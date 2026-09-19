# OOME Minerals Institutional Website — Staging Build

## Public positioning
OOME Minerals is presented as an Accra, Ghana-based B2B minerals business with two deliberate divisions:

1. Mining Consultancy & Transaction Advisory.
2. Licensed Gold Dealing & Export — only where OOME holds confirmed authority and individual transactions have passed required controls.

Trade facilitation and supply-chain/buyer due diligence are service/control layers, not ambiguous standalone business lines.

## Claim boundaries
- Do **not** add GoldBod, regulator, assay laboratory, refinery, buyer or partner logos without documented authorisation.
- Do **not** publish gold prices, stock, volume, delivery promises, export assurances, licence numbers, customer names, case studies or named team credentials until verified.
- Do **not** claim public approval, certification or authorisation beyond legally approved wording.
- The buyer-enquiry form is intentionally staged: it validates input locally but does not transmit data. A verified controlled email/CRM endpoint, privacy notice, data-retention process and legal review are launch blockers.

## Assets
| File | Role | Source/status |
|---|---|---|
| `assets/oome-logo-transparent.png` | Original selected logo lock-up | User-approved raster derivative; transparent PNG |
| `assets/oome-wordmark-landscape.png` | Header/footer wordmark | User-approved raster derivative; transparent PNG |
| `assets/oome-hero-mineral.png` | Hero poster/fallback | Illustrative image generated through OpenAI Codex OAuth / GPT Image 2 Medium |
| `assets/oome-hero-visual-master.mp4` | Silent video hero | 15-second slow-panning illustrative visual master derived from the hero image; not a real mine, transaction or operation |

## Run locally
```bash
cd /root/projects/oome-minerals-site
python -m http.server 8080
```
Then open `http://localhost:8080`.

## Before public launch
1. Add the verified legal entity, registered address, controlled email/telephone and privacy/terms pages.
2. Confirm exact GoldBod/Ghanaian licence wording and public permissions with counsel.
3. Connect the enquiry form to an approved secure endpoint with retention and data-protection controls.
4. Add authorised leadership biographies/headshots and factual professional partners only.
5. Select canonical domain, configure HTTPS, metadata, robots/sitemap and a deployment target.
