# Form Analytics Tracking Guide

## Overview
Form abandonment and progress tracking has been implemented on `diy-registration.html` using Google Analytics 4 (GA4). This document explains what's being tracked and how to analyze the data.

---

## 📊 What's Being Tracked

### 1. **Form Start** (`form_start`)
- **Triggers when**: User interacts with any form field for the first time
- **Data captured**:
  - `form_name`: "diy_registration"
  - `form_type`: "registration"
- **Use case**: Total number of users who started filling the form

### 2. **Field Interactions** (`form_field_interaction`)
- **Triggers when**: User focuses on a field for the first time
- **Data captured**:
  - `form_name`: "diy_registration"
  - `field_name`: Name of the field (e.g., "fullName", "email", "username")
  - `field_type`: Type of field (e.g., "text", "email", "password", "select")
- **Use case**: Which fields users interact with most; identify where users drop off

### 3. **Step Progression** (`form_step_view`)
- **Triggers when**: User reaches a new step in the form
- **Data captured**:
  - `form_name`: "diy_registration"
  - `step_number`: 1 or 2
  - `step_name`: "personal_info" or "system_info"
- **Use case**: How many users progress from Step 1 to Step 2

### 4. **Step Completion** (`form_step_complete`)
- **Triggers when**: User completes a specific step
- **Data captured**:
  - `form_name`: "diy_registration"
  - `step_number`: 1 or 2
  - `step_name`: Name of completed step
- **Use case**: Track completion rates for each step

### 5. **Authentication Mode Selection** (`auth_mode_select`)
- **Triggers when**: User chooses between direct connection or simulation mode
- **Data captured**:
  - `form_name`: "diy_registration"
  - `auth_mode`: "direct_connection" or "simulation"
- **Use case**: Understand which registration path users prefer

### 6. **File Upload** (`file_upload`)
- **Triggers when**: User successfully uploads electricity bills
- **Data captured**:
  - `form_name`: "diy_registration"
  - `file_count`: Number of files uploaded
  - `total_size_mb`: Total size in MB
- **Use case**: Track how many users upload bills and typical file sizes

### 7. **VPP Opt-In** (`vpp_opt_in`)
- **Triggers when**: User checks the VPP participation checkbox
- **Data captured**:
  - `form_name`: "diy_registration"
- **Use case**: Track VPP program interest rate

### 8. **Form Errors** (`form_error`)
- **Triggers when**: Validation errors or upload errors occur
- **Data captured**:
  - `form_name`: "diy_registration"
  - `error_type`: Type of error (e.g., "validation_failed", "file_size_exceeded", "api_error")
  - `error_message`: Detailed error message
- **Use case**: Identify common error points that frustrate users

### 9. **Submit Attempt** (`form_submit_attempt`)
- **Triggers when**: User clicks the submit button
- **Data captured**:
  - `form_name`: "diy_registration"
  - `fields_completed`: Number of unique fields the user interacted with
- **Use case**: Track how many users reach the submit stage

### 10. **Submit Success** (`form_submit_success`)
- **Triggers when**: Form is successfully submitted to the API
- **Data captured**:
  - `form_name`: "diy_registration"
  - `registration_mode`: "simulation" or "direct_connection"
  - `fields_completed`: Number of fields completed
- **Use case**: Track successful registrations and preferred mode

### 11. **Form Abandonment** (`form_abandon`)
- **Triggers when**: 
  - User leaves the page (closes tab/navigates away)
  - User switches tabs/windows
  - User is inactive for 2 minutes
- **Data captured**:
  - `form_name`: "diy_registration"
  - `last_field_interacted`: Last field the user touched
  - `fields_completed`: Total number of fields completed
  - `step1_started`: Boolean
  - `step2_started`: Boolean
- **Use case**: **Most important metric** - shows exactly where users abandon the form

---

## 📈 How to View Data in Google Analytics 4

### Method 1: Events Report (Detailed View)

1. **Log in to Google Analytics**: https://analytics.google.com
2. **Select your property**: G-05XLDKW0MN
3. **Navigate to**: Reports → Engagement → Events
4. **Look for these events**:
   - `form_start`
   - `form_field_interaction`
   - `form_step_view`
   - `form_submit_attempt`
   - `form_submit_success`
   - `form_abandon` ⭐ **Most important**
   - `form_error`
   - `file_upload`
   - `auth_mode_select`

5. **Click on any event** to see:
   - Event count
   - Users who triggered it
   - Custom parameters (field names, error types, etc.)

### Method 2: Exploration (Custom Analysis)

1. **Navigate to**: Explore → Create a new exploration
2. **Choose**: Free Form exploration
3. **Add dimensions**:
   - Event name
   - Event parameters (field_name, error_type, step_name, etc.)
4. **Add metrics**:
   - Event count
   - Total users
   - Conversion rate

### Method 3: Create a Funnel Analysis

1. **Navigate to**: Explore → Funnel exploration
2. **Set up your funnel**:
   - Step 1: `form_start` (Form Started)
   - Step 2: `form_step_view` [step_number = 1] (Step 1 Viewed)
   - Step 3: `form_step_view` [step_number = 2] (Step 2 Viewed)
   - Step 4: `form_submit_attempt` (Submit Clicked)
   - Step 5: `form_submit_success` (Successfully Submitted)

3. **View drop-off rates** at each step

---

## 🎯 Key Metrics to Monitor

### 1. **Completion Rate**
```
(form_submit_success / form_start) × 100
```
**Goal**: >30% completion rate

### 2. **Step 1 to Step 2 Progression**
```
(form_step_view [step_number=2] / form_step_view [step_number=1]) × 100
```
**Goal**: >70% progression rate

### 3. **Top Abandonment Points**
- View `form_abandon` event
- Sort by `last_field_interacted` parameter
- **Action**: If a specific field has high abandonment, consider:
  - Simplifying the field
  - Adding help text
  - Making it optional

### 4. **Error Frequency**
- View `form_error` event
- Sort by `error_type`
- **Action**: Fix the most common errors

### 5. **Direct Connection vs Simulation**
- Compare `auth_mode_select` event parameters
- **Insight**: Which path do users prefer?

### 6. **File Upload Success Rate**
- Compare:
  - Users who reach file upload field
  - Users who successfully upload (`file_upload` event)
- **Action**: If low, improve upload UX

---

## 🔍 Example Questions You Can Answer

### "Where do users abandon the form?"
1. Go to Events → `form_abandon`
2. Add secondary dimension: `last_field_interacted`
3. Sort by event count (descending)
4. **Result**: You'll see which field users were on when they left

### "How many users complete Step 1 but abandon at Step 2?"
1. Go to Explore → Funnel
2. Compare `form_step_view` [step_number=1] vs [step_number=2]
3. **Result**: Drop-off percentage between steps

### "What's the most common error?"
1. Go to Events → `form_error`
2. Add secondary dimension: `error_type`
3. **Result**: Most frequent error types

### "Do users with credentials complete faster?"
1. Go to Explore → Free Form
2. Segment by `auth_mode_select` parameter
3. Compare completion rates
4. **Result**: Completion rate by authentication mode

### "Are mobile users abandoning more?"
1. Go to Events → `form_abandon`
2. Add secondary dimension: Device category
3. Compare mobile vs desktop
4. **Result**: Abandonment rate by device

---

## 🚨 Alerts You Should Set Up

### 1. **High Abandonment Alert**
- **Condition**: If `form_abandon` events > 50% of `form_start` events in a day
- **Action**: Investigate immediately - something might be broken

### 2. **API Error Spike**
- **Condition**: If `form_error` with `error_type=api_error` > 5 in an hour
- **Action**: Check your API endpoint health

### 3. **Low Completion Rate**
- **Condition**: If completion rate < 20% for a week
- **Action**: Review form UX and optimize problematic fields

---

## 📝 Best Practices for Ongoing Analysis

### Weekly Review
- Check overall completion rate trend
- Identify top 3 abandonment fields
- Review new error types

### Monthly Deep Dive
- Funnel analysis (complete flow)
- Cohort analysis (first-time vs returning users)
- Device/browser breakdown
- A/B test results (if running experiments)

### Continuous Improvement
1. **Identify** the field with highest abandonment
2. **Hypothesize** why users are dropping off
3. **Implement** a fix (better help text, make optional, etc.)
4. **Measure** if abandonment rate decreases
5. **Repeat** with next problem field

---

## 🔒 Privacy & Compliance

✅ **No PII is tracked**: We only track field names, not field values
✅ **GDPR/CCPA compliant**: No personal data is sent to Google Analytics
✅ **User consent**: Form is behind user action (they chose to fill it)

**What we DON'T track**:
- Actual email addresses
- Phone numbers
- Passwords
- Personal information entered in fields
- System credentials

**What we DO track**:
- Which fields users interact with
- When users abandon
- Error types (not sensitive data)
- Aggregated user behavior

---

## 🛠️ Troubleshooting

### "I don't see events in GA4"
- **Check 1**: Wait 24-48 hours (GA4 has a delay)
- **Check 2**: Use DebugView (GA4 → Configure → DebugView) for real-time testing
- **Check 3**: Open browser console and look for "📊 Analytics:" logs

### "Events are firing but parameters are missing"
- **Check**: Event parameters take longer to appear in reports
- **Solution**: Use the "Event parameters" section when viewing individual events

### "Too much data, can't find insights"
- **Solution**: Create custom reports focusing on:
  - `form_abandon` (most important)
  - `form_submit_success` (conversion tracking)
  - Funnel from start to success

---

## 📞 Need Help?

If you need assistance analyzing the data or setting up custom reports:
1. Check GA4 Help Center: https://support.google.com/analytics
2. Review this guide's example queries
3. Contact your analytics team with specific questions using the event names listed above

---

## 🎉 Quick Wins

Based on analytics data, you can quickly improve form completion by:

1. **Making optional fields truly optional** if users abandon at them
2. **Simplifying error messages** if `form_error` events are high
3. **Improving mobile UX** if mobile users abandon more
4. **Shortening the form** if abandonment is high throughout
5. **Adding progress indicators** if Step 1→2 progression is low
6. **Pre-filling fields** when possible (e.g., city/state from IP)
7. **Saving progress** so users can return later

---

**Last Updated**: November 10, 2025
**Analytics Version**: Google Analytics 4 (GA4)
**Property ID**: G-05XLDKW0MN

