# Responsible Vulnerability Disclosure Report

## Unauthenticated Access to Training Application Data - Broken Object Level Authorization

**Target:** https://www.datheon.in
**Date Tested:** 05 November 2026
**Researcher:** Emihle
**Status:** Disclosed for Educational / Training Assessment

---

## 1. Executive Summary

An unauthenticated Broken Object Level Authorization (BOLA / IDOR) vulnerability was identified in the Training Application API.

The endpoint `/api/training/auth-app` returns full personal application data for any user when supplied with only their email address as a URL query parameter. No login, session cookie, Authorization header, or token is required.

Any remote attacker who knows or guesses a victim's email address can retrieve their full application record.

## 2. Severity - CVSS 3.1

**Score: 7.5 - HIGH**

**Vector:** CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N

The vulnerability allows unauthenticated disclosure of sensitive personal data.

## 3. Affected Endpoint
GET https://www.datheon.in/api/training/auth-app?email=victim@example.com

## 4. Proof of Concept

No authentication required. Changing the `email` parameter returns a different user's full application data.

## 5. Impact

- Exposure of full names, emails, phone numbers, ID numbers
- Privacy violation and identity theft risk
- Mass enumeration of applicant data

## 6. Remediation

- Require authentication (session / JWT) on all API endpoints
- Enforce server-side authorization: only return data belonging to the logged-in user
- Never trust `email` or `id` from URL query parameters alone
- Return 401 if not logged in, 403 if accessing another user's data

## 7. Fix Implemented in This Repo

Fixed in `app/api/candidates/[id]/route.ts`:

- Checks `x-user-email` header
- Returns 401 if not logged in
- Returns 404 if candidate does not belong to the logged-in user
- Only the owner can view their own record
