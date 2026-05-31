/* =====================================================================
 * MicroVPP state-context module
 * ---------------------------------------------------------------------
 * Single source of truth for the user's selected state (California or
 * Texas) across the home page and the DIY registration steps.
 *
 *  - State lives in localStorage under "microvpp_state".
 *  - The home page's state-toggle pill writes it; the DIY pages read it.
 *  - DIY pages can read or update the state through window.MicroVppState.
 *
 * Drop-in usage on any HTML page:
 *
 *   <script src="assets/js/state-context.js"></script>
 *   ...
 *   <div class="header-buttons">
 *     <a href="index.html" class="state-badge" id="microvppStateBadge">
 *       <span class="state-badge-flag">☀️</span>
 *       <span class="state-badge-label">California</span>
 *     </a>
 *     ...
 *   </div>
 *
 * The module:
 *   - Picks the active state from localStorage / URL param (default: CA)
 *   - Hydrates the badge text + flag
 *   - Removes any legacy "California (NEM 3.0)" nav link that pointed to
 *     #nem on the home page (that section no longer carries that label).
 *   - Exposes utility / REP option lists for the step-2 form.
 *
 * Public API on window.MicroVppState:
 *   - .state           current state ("california" | "texas")
 *   - .label           "California" | "Texas"
 *   - .flag            "☀️" | "🤠"
 *   - .short           "CA" | "TX"
 *   - .displayName     Same as label (kept for clarity at call-sites)
 *   - .utilityOptions  { california: [...], texas: [...] }
 *   - .fieldMeta       Localized label / help / placeholder per state
 *   - .set(next)                              Change the state (persists)
 *   - .onChange(fn)                           Subscribe to changes
 *   - .normalize(raw)                         "Texas"/"tx"/... -> "texas"
 *   - .displayNameOf(s)                       "texas" -> "Texas"
 *   - .populateUtilitySelect(el, selectedVal) Re-populate a <select>
 *   - .updateUtilityFieldMeta(state)          Update label/help text IDs
 *
 * Also fires a `microvppstatechange` DOM event on `document` whenever
 * the state changes, with `event.detail.state`.
 * ===================================================================== */

(function () {
    'use strict';

    var STORAGE_KEY = 'microvpp_state';
    var VALID = ['california', 'texas'];

    var COPY = {
        california: { flag: '☀️', label: 'California', short: 'CA' },
        texas:      { flag: '🤠', label: 'Texas',      short: 'TX' }
    };

    // Utility / REP dropdown options, per state.
    // California: investor-owned utilities (IOUs) + the two large munis.
    // Texas: a curated list of the largest Houston-area REPs serving
    // CenterPoint territory. "Other" is always last.
    var UTILITY_OPTIONS = {
        california: [
            { value: 'PG&E',  label: 'Pacific Gas & Electric (PG&E)' },
            { value: 'SCE',   label: 'Southern California Edison (SCE)' },
            { value: 'SDG&E', label: 'San Diego Gas & Electric (SDG&E)' },
            { value: 'SMUD',  label: 'Sacramento Municipal Utility District (SMUD)' },
            { value: 'LADWP', label: 'Los Angeles Department of Water and Power (LADWP)' },
            { value: 'Other', label: 'Other Utility' }
        ],
        texas: [
            { value: 'TXU Energy',            label: 'TXU Energy' },
            { value: 'Reliant Energy',        label: 'Reliant Energy' },
            { value: 'Octopus Energy',        label: 'Octopus Energy' },
            { value: 'Gexa Energy',           label: 'Gexa Energy' },
            { value: 'Green Mountain Energy', label: 'Green Mountain Energy' },
            { value: 'Direct Energy',         label: 'Direct Energy' },
            { value: '4Change Energy',        label: '4Change Energy' },
            { value: 'Discount Power',        label: 'Discount Power' },
            { value: 'Constellation',         label: 'Constellation' },
            { value: 'Cirro Energy',          label: 'Cirro Energy' },
            { value: 'Rhythm Energy',         label: 'Rhythm Energy' },
            { value: 'Other',                 label: 'Other REP' }
        ]
    };

    var FIELD_META = {
        california: {
            label: 'Utility Company',
            help:  'Used for tariff and NEM 3.0 calculations.',
            placeholder: 'Select Utility Company (optional)',
            required: false
        },
        texas: {
            label: 'Retail Electric Provider (REP)',
            help:  "Tell us who serves you — we use this to match available plans in CenterPoint territory.",
            placeholder: 'Select your REP',
            required: true
        }
    };

    // ----- One-time CSS injection for the badge ----------------------
    function injectBadgeCss() {
        if (document.getElementById('microvppStateBadgeCss')) return;
        var style = document.createElement('style');
        style.id = 'microvppStateBadgeCss';
        style.textContent = [
            '.state-badge{',
            '  display:inline-flex;align-items:center;gap:0.4rem;',
            '  padding:0.45rem 0.85rem;',
            '  background:rgba(16,185,129,0.08);',
            '  border:1px solid rgba(16,185,129,0.28);',
            '  border-radius:999px;',
            '  font-size:0.85rem;font-weight:600;',
            '  color:#065f46;text-decoration:none;',
            '  line-height:1;',
            '  transition:background .2s ease, border-color .2s ease, transform .2s ease;',
            '  white-space:nowrap;',
            '}',
            '.state-badge:hover{',
            '  background:rgba(16,185,129,0.16);',
            '  border-color:rgba(16,185,129,0.45);',
            '  transform:translateY(-1px);',
            '}',
            '.state-badge-flag{font-size:1rem;line-height:1;}',
            '.state-badge-label{line-height:1;}',
            '@media (max-width:640px){',
            '  .state-badge{padding:0.45rem 0.7rem;font-size:0.85rem;gap:0.35rem;}',
            '  .state-badge-flag{font-size:1.05rem;}',
            '}'
        ].join('\n');
        (document.head || document.documentElement).appendChild(style);
    }

    // ----- Initial state resolution ----------------------------------
    function readInitialState() {
        // 1. URL param `?state=...`
        try {
            var params = new URLSearchParams(window.location.search);
            var p = (params.get('state') || '').trim().toLowerCase();
            if (p === 'california' || p === 'cal' || p === 'ca') return 'california';
            if (p === 'texas'      || p === 'tex' || p === 'tx') return 'texas';
        } catch (_) { /* noop */ }
        // 2. localStorage (set by home page state toggle)
        try {
            var stored = (localStorage.getItem(STORAGE_KEY) || '').toLowerCase();
            if (VALID.indexOf(stored) !== -1) return stored;
        } catch (_) { /* noop */ }
        // 3. Default
        return 'california';
    }

    var state = readInitialState();
    var listeners = [];

    function normalizeStateName(raw) {
        if (raw === null || raw === undefined) return null;
        var s = String(raw).trim().toLowerCase();
        if (s === 'california' || s === 'cal' || s === 'ca') return 'california';
        if (s === 'texas'      || s === 'tex' || s === 'tx') return 'texas';
        return null;
    }

    function displayNameOf(s) {
        return s === 'texas' ? 'Texas' : 'California';
    }

    function setState(next) {
        var n = normalizeStateName(next);
        if (!n) return state;
        if (n === state) {
            updateBadge();
            return state;
        }
        state = n;
        try { localStorage.setItem(STORAGE_KEY, n); } catch (_) { /* noop */ }
        api.state       = n;
        api.label       = COPY[n].label;
        api.flag        = COPY[n].flag;
        api.short       = COPY[n].short;
        api.displayName = displayNameOf(n);
        updateBadge();
        listeners.forEach(function (fn) { try { fn(n); } catch (_) { /* noop */ } });
        try {
            document.dispatchEvent(new CustomEvent('microvppstatechange', {
                detail: { state: n }
            }));
        } catch (_) { /* noop */ }
        return n;
    }

    function onChange(fn) {
        if (typeof fn === 'function') listeners.push(fn);
    }

    // ----- Badge UI --------------------------------------------------
    function updateBadge() {
        var badge = document.getElementById('microvppStateBadge');
        if (!badge) return;
        var flagEl  = badge.querySelector('.state-badge-flag');
        var labelEl = badge.querySelector('.state-badge-label');
        if (flagEl)  flagEl.textContent  = COPY[state].flag;
        if (labelEl) labelEl.textContent = COPY[state].label;
        badge.setAttribute('data-state', state);
        // Helpful tooltip explains how to change it.
        if (!badge.getAttribute('title')) {
            badge.setAttribute(
                'title',
                'Your selected state — open the home page to switch.'
            );
        }
    }

    // ----- Remove orphan nav link ------------------------------------
    // The home page no longer carries a "California (NEM 3.0)" entry
    // (it now has a state toggle). Strip any stale link to #nem so the
    // header navigation stays accurate across the DIY flow.
    function removeOrphanNavLink() {
        var anchors = document.querySelectorAll(
            '.nav-links a[href="index.html#nem"], .nav-links a[href="#nem"]'
        );
        anchors.forEach(function (a) {
            var li = a.closest('li');
            if (li && li.parentNode) li.parentNode.removeChild(li);
            else if (a.parentNode) a.parentNode.removeChild(a);
        });
    }

    // ----- Utility / REP dropdown helpers ----------------------------
    function populateUtilitySelect(selectEl, selectedValue, opts) {
        if (!selectEl) return;
        opts = opts || {};
        var s = normalizeStateName(opts.state) || state;
        var meta = FIELD_META[s] || FIELD_META.california;
        var list = UTILITY_OPTIONS[s] || UTILITY_OPTIONS.california;

        selectEl.innerHTML = '';
        var placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = meta.placeholder;
        selectEl.appendChild(placeholder);

        list.forEach(function (opt) {
            var o = document.createElement('option');
            o.value = opt.value;
            o.textContent = opt.label;
            if (selectedValue && opt.value === selectedValue) o.selected = true;
            selectEl.appendChild(o);
        });
    }

    function updateUtilityFieldMeta(s) {
        var which = normalizeStateName(s) || state;
        var meta  = FIELD_META[which] || FIELD_META.california;
        var lbl   = document.getElementById('utilityCompanyLabel');
        var help  = document.getElementById('utilityCompanyHelp');
        var sel   = document.getElementById('utilityCompany');
        // Texas (REP) is mandatory; California (utility) is optional.
        var isRequired = !!meta.required;
        if (lbl)  lbl.innerHTML    = meta.label + (isRequired ? ' <span style="color: #ef4444;">*</span>' : '');
        if (help) help.textContent = meta.help;
        if (sel) {
            if (isRequired) sel.setAttribute('required', 'required');
            else            sel.removeAttribute('required');
        }
    }

    // ----- Public API ------------------------------------------------
    var api = {
        state:       state,
        label:       COPY[state].label,
        flag:        COPY[state].flag,
        short:       COPY[state].short,
        displayName: displayNameOf(state),
        copy:            COPY,
        utilityOptions:  UTILITY_OPTIONS,
        fieldMeta:       FIELD_META,
        set:                    setState,
        onChange:               onChange,
        populateUtilitySelect:  populateUtilitySelect,
        updateUtilityFieldMeta: updateUtilityFieldMeta,
        normalize:              normalizeStateName,
        displayNameOf:          displayNameOf
    };
    window.MicroVppState = api;

    // ----- Boot ------------------------------------------------------
    function boot() {
        injectBadgeCss();
        updateBadge();
        removeOrphanNavLink();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
