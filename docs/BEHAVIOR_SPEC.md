# Behaviour spec

## /lp/treatments enquiry form

The Google Ads landing page's enquiry form. Built to the NMC advertising guidelines and the clinic's tracking and privacy rules. Change it only against this spec.

### Switch

- `showEnquiryForm` in `content/pages/lp-treatments.json`. **Production value: `false`** until the doctor approves.
- Off: no form section, no Enquiry buttons. The page offers Call Clinic and WhatsApp only, and the mobile bar has two buttons.
- On: the form renders inline in `#enquiry`. The hero gets an "Enquiry" button linking to it, and the mobile bar gets a third button.
- The form is inline only. There is no popup, auto-open or exit-intent. The site-wide popup is off (`content/pages/popup.json`) and is not mounted on `/lp/*`.

### Fields

| Field | Rule |
| --- | --- |
| Name | Required, 2–80 characters. |
| Mobile number | Required. An Indian mobile: 10 digits starting 6–9, with or without `+91`, `91` or `0` in front. Spaces, dashes, dots and brackets are ignored. Stored as `+91XXXXXXXXXX`. |
| Preferred callback time | Required. One of Morning / Afternoon / Evening (`morning`, `afternoon`, `evening`). |

There is no email field and no free-text field. A hidden honeypot (`website`) is filled only by bots. If it is filled, the lead is accepted silently and not recorded.

### Copy

- Section heading: "Send an enquiry".
- Consent line, directly above the button, with no checkbox: "We will use these details only to contact you about your enquiry."
- Button: "Send enquiry".
- Success: "Thank you. The clinic will call you back during working hours."
- Failure: "Your enquiry could not be sent. Please call the clinic or message us on WhatsApp."
- Never use: "Book now", "Free", "Limited", discounts, priority, outcome promises or urgency.

### Submission

1. The browser validates the fields, then sends **one** `POST /api/enquiry` with a JSON body. No name, phone or callback time ever appears in a URL, query string or redirect.
2. `/api/enquiry` (POST only) validates the lead again and normalises the phone. It then records the lead in Funnel Agent, server to server:
   - **`/identify`:** sends `name` and `phone`, plus `consent_timestamp` (the server receipt time) and `consent_source: "form:lp_treatments"`.
     - `whatsapp_opt_in` is deliberately not sent: the consent covers a call back only, and Funnel Agent uses that flag to send automated WhatsApp messages.
   - **`/track`, `form_submit` event:** the metadata carries:

     | Key | Value |
     | --- | --- |
     | `form` | `"lp_treatments"` |
     | `fields` | `{ callback_time }` |
     | `consent` | `true` |
     | `consent_at` | the consent time |
     | `consent_text` | the consent line, verbatim |
     | `gclid` | when present |

   - **Linking:** both calls use the visitor's Funnel Agent id from the `fa_anon` cookie. If the cookie is missing, the server creates an id, so the event still attaches to the lead.
   - **Tenant:** both calls send `X-Site-Id: default`, the same tenant key every lead from this site carries. Funnel Agent has no separate `clinic_id`.
3. The route returns `{ ok: true }` only after Funnel Agent has accepted both calls. If Funnel Agent rejects or is unreachable, it returns 502 and the form shows the failure message.
4. The form carries `data-fa-no-capture`, so the Funnel Agent browser tag does not read it on submit. The lead reaches Funnel Agent once, already validated, from the server.
5. Names and numbers are never logged.

### Google Ads click ID

- On any `/lp/*` page, a `gclid` URL parameter is stored in the first-party cookie `se_gclid` with `Max-Age` 90 days, `Path=/`, `SameSite=Lax`, and `Secure` on https. Only `[A-Za-z0-9_-]{1,200}` is accepted.
- `/api/enquiry` reads the cookie and stores the gclid on the lead's `form_submit` event in Funnel Agent. That event is linked to the lead (`events.lead_id`).
- To fetch gclids for an offline conversion upload:

  ```sql
  SELECT l.id, e.metadata->>'gclid' AS gclid, e.occurred_at
  FROM events e
  JOIN leads l ON l.id = e.lead_id
  WHERE e.event_type = 'form_submit' AND e.metadata ? 'gclid';
  ```

### Analytics

- GA4 `generate_lead` fires only after `/api/enquiry` has returned `ok: true`. It never fires on click, on a validation error or on a server failure.
- Its only parameter is `form_location: "lp_treatments"`. The name, phone, callback time, gclid and any lead or visitor id are never sent to GA or Google Ads.
- GA4's built-in form tracking may also send `form_start` and `form_submit`. These carry the form id and field names, never field values.
- The Call and WhatsApp buttons send `click_call` and `click_whatsapp` with the clinic's own link only.
