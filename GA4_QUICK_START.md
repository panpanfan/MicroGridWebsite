# Google Analytics 4 - Quick Start Guide
## Finding Your Form Analytics Data

---

## 🚀 5-Minute Setup to View Form Abandonment

### Step 1: Access Google Analytics
1. Go to: **https://analytics.google.com**
2. Log in with your Google account
3. Select property: **G-05XLDKW0MN** (Your MicroGrid property)

---

### Step 2: View All Form Events
**Path**: Reports → Engagement → Events

You'll see a list of events. Look for these:

```
Event Name                    | What It Means
------------------------------|---------------------------------------
form_start                    | Users who started filling the form
form_field_interaction        | Which fields users clicked
form_step_view               | Users progressing through steps
form_abandon                 | 🔥 Users who quit (MOST IMPORTANT)
form_submit_attempt          | Users who clicked submit
form_submit_success          | Successful form submissions
form_error                   | Errors users encountered
file_upload                  | File upload attempts
auth_mode_select             | Direct vs simulation choice
```

---

### Step 3: Find Where Users Are Abandoning

**This is the most important analysis:**

1. Click on the **`form_abandon`** event
2. Click **"View event details"** or **"Event parameters"**
3. Look for parameter: **`last_field_interacted`**
4. Sort by count (descending)

**You'll see something like:**

```
last_field_interacted    | Count | Percentage
-------------------------|-------|------------
username                 | 45    | 35% ← Fix this first!
batteryCapacity          | 30    | 23%
email                    | 20    | 15%
phone                    | 15    | 12%
...
```

**Action**: The field with the highest count is where most users quit. Fix that field first!

---

### Step 4: Calculate Your Completion Rate

**Path**: Reports → Engagement → Events

1. Find **`form_start`** - note the count (e.g., 200 users)
2. Find **`form_submit_success`** - note the count (e.g., 50 users)

**Formula**:
```
Completion Rate = (form_submit_success / form_start) × 100
Example: (50 / 200) × 100 = 25%
```

**Benchmarks**:
- 😞 Below 15%: Poor - needs immediate attention
- 🤔 15-25%: Average - room for improvement
- 🙂 25-35%: Good - keep optimizing
- 😄 35%+: Excellent!

---

### Step 5: Create a Simple Funnel Report

**Path**: Explore (left sidebar) → Create new exploration → Funnel exploration

**Setup your funnel:**

1. **Step 1**: `form_start` (baseline)
2. **Step 2**: `form_step_view` with `step_number = 1`
3. **Step 3**: `form_step_view` with `step_number = 2`
4. **Step 4**: `form_submit_attempt`
5. **Step 5**: `form_submit_success`

**Result**: You'll see a visual funnel showing drop-off at each stage.

Example:
```
form_start              100 users   ━━━━━━━━━━━━━━━━━━━━ 100%
form_step_view (1)       85 users   ━━━━━━━━━━━━━━━━    85% (-15%)
form_step_view (2)       60 users   ━━━━━━━━━━━━         60% (-25%) ← Big drop!
form_submit_attempt      40 users   ━━━━━━━━             40%
form_submit_success      35 users   ━━━━━━               35%
```

---

## 🎯 3 Most Important Questions to Answer

### Question 1: "Where do users quit?"

**Answer**: 
- Go to: Events → `form_abandon`
- Look at: `last_field_interacted` parameter
- **Fix**: The top 2-3 fields where users abandon

---

### Question 2: "What's my conversion rate?"

**Answer**:
- Go to: Events
- Calculate: `form_submit_success / form_start × 100`
- **Goal**: Increase this percentage over time

---

### Question 3: "What errors are users seeing?"

**Answer**:
- Go to: Events → `form_error`
- Look at: `error_type` parameter
- Common types:
  - `validation_failed` - Missing required fields
  - `file_size_exceeded` - Files too large
  - `invalid_file_type` - Wrong file format
  - `api_error` - Backend issues
- **Fix**: Address the most common error type

---

## 📊 Weekly Checklist (5 minutes)

Run this quick analysis every Monday:

### ✅ Week 1: Baseline
- [ ] Check `form_start` count (how many users?)
- [ ] Check `form_submit_success` count (how many completed?)
- [ ] Calculate completion rate
- [ ] Identify #1 abandonment field

### ✅ Week 2: First Optimization
- [ ] Did completion rate improve vs last week?
- [ ] Is #1 abandonment field still the same?
- [ ] Any new error types appearing?
- [ ] Implement fix for #1 abandonment field

### ✅ Week 3+: Iterate
- [ ] Track week-over-week completion rate trend
- [ ] Move to next biggest problem field
- [ ] Monitor error rate
- [ ] Check mobile vs desktop performance

---

## 🔍 Advanced: Segment by Device

Want to see if mobile users abandon more?

1. Go to: Events → `form_abandon`
2. Add secondary dimension: **Device category**
3. Compare:
   - Desktop abandonment rate
   - Mobile abandonment rate
   - Tablet abandonment rate

**If mobile is significantly worse**: Optimize mobile UX first!

---

## 🎨 Custom Dashboard (Optional)

Create a dedicated form performance dashboard:

**Path**: Reports → Library → Create new report

**Add these cards**:

1. **Card 1**: Form starts (last 7 days)
   - Metric: `form_start` event count

2. **Card 2**: Completion rate
   - Formula: `form_submit_success / form_start`

3. **Card 3**: Top abandonment fields
   - Event: `form_abandon`
   - Dimension: `last_field_interacted`

4. **Card 4**: Error count
   - Metric: `form_error` event count

5. **Card 5**: Funnel visualization
   - All 5 steps from start to success

**Save** and check this dashboard every Monday!

---

## 🚨 Set Up Alerts

Get notified when something goes wrong:

**Path**: Configure → Custom alerts

### Alert 1: High Abandonment
- **Condition**: `form_abandon` > 50 events in 1 day
- **Action**: Email notification
- **Why**: Sudden spike might indicate a bug

### Alert 2: API Errors
- **Condition**: `form_error` with `error_type=api_error` > 5 in 1 hour
- **Action**: Email + Slack notification
- **Why**: Backend might be down

### Alert 3: Zero Submissions
- **Condition**: `form_submit_success` = 0 for 24 hours
- **Action**: Email notification
- **Why**: Form might be broken

---

## 🧪 Testing Your Tracking

Want to verify everything is working?

### Method 1: DebugView (Recommended)
1. Go to: Configure → DebugView
2. Open your form in another tab
3. Fill out some fields
4. Watch events appear in real-time! ✨

### Method 2: Browser Console
1. Open form: `diy-registration.html`
2. Press F12 (open developer tools)
3. Go to Console tab
4. Fill out fields
5. Look for: `📊 Analytics: Form started` messages

---

## 💡 Quick Wins Based on Data

Once you have 7 days of data:

### If abandonment is high at "username":
- ✅ Add tooltip explaining what credentials to use
- ✅ Link to "forgot credentials" help page
- ✅ Make field optional and follow up later

### If abandonment is high at "batteryCapacity":
- ✅ Add examples: "e.g., 13.5"
- ✅ Add help text: "Found on your inverter datasheet"
- ✅ Make optional if username/password provided

### If abandonment is high at file upload:
- ✅ Make uploads optional
- ✅ Show sample electricity bill image
- ✅ Allow upload after registration

### If mobile abandonment > desktop:
- ✅ Simplify mobile layout
- ✅ Reduce number of fields
- ✅ Make text inputs larger
- ✅ Use mobile-friendly file picker

---

## 📞 Need Help?

### Can't find events?
- **Wait 24-48 hours**: GA4 has a processing delay
- **Use DebugView**: For real-time testing

### Events firing but no parameters?
- **Wait longer**: Parameters take extra time to process
- **Check event details**: Click on specific event

### Too much data?
- **Start simple**: Focus only on `form_abandon`
- **Use date range**: Last 7 days only
- **Filter**: Focus on one step at a time

---

## ✅ Success Checklist

After implementing analytics, you should be able to:

- [ ] See `form_start` event count in GA4
- [ ] See `form_abandon` event count in GA4
- [ ] View which fields users abandon at
- [ ] Calculate form completion rate
- [ ] Create a basic funnel report
- [ ] Identify the #1 problem field to fix

**If you can do all of the above, you're ready to start optimizing!**

---

## 📈 Expected Timeline

- **Day 1**: Implementation complete (done!)
- **Day 2-7**: Data collection (be patient)
- **Day 8**: First analysis (identify problems)
- **Day 9-14**: Implement fixes
- **Day 15**: Measure improvement
- **Day 16+**: Continuous optimization

**Remember**: Small improvements compound over time!

---

## 🎯 One-Sentence Summary

**Go to GA4 → Events → `form_abandon` → View `last_field_interacted` parameter → Fix the field where most users quit.**

---

**Last Updated**: November 10, 2025
**Your Property**: G-05XLDKW0MN
**Form**: diy-registration.html

Good luck! 🚀

