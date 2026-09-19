from pathlib import Path
import re

root = Path('/root/projects/oome-minerals-site')
base = 'https://oome-minerals.vercel.app'
pages = {
    'index.html': {
        'path': '/',
        'title': 'OOME Minerals | Mining Consultancy & Responsible Gold Trade | Accra, Ghana',
        'description': 'OOME Minerals is an Accra, Ghana-based mining consultancy and responsible gold-trade engagement platform for qualified counterparties.',
        'h1': 'Mining consultancy.<br><em>Responsible gold trade.</em>',
        'schema': '<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://oome-minerals.vercel.app/#organization","name":"OOME Minerals","url":"https://oome-minerals.vercel.app/","logo":"https://oome-minerals.vercel.app/assets/oome-wordmark-landscape.png","description":"Accra, Ghana-based mining consultancy and responsible gold-trade engagement platform for qualified counterparties.","areaServed":{"@type":"Country","name":"Ghana"}},{"@type":"WebSite","@id":"https://oome-minerals.vercel.app/#website","url":"https://oome-minerals.vercel.app/","name":"OOME Minerals","publisher":{"@id":"https://oome-minerals.vercel.app/#organization"}}]}</script>'
    },
    'consultancy.html': {'path': '/consultancy.html', 'title': 'Mining Consultancy & Transaction Advisory | OOME Minerals | Ghana', 'description': 'Mining consultancy and transaction advisory from Accra, Ghana: commercial readiness, sourcing frameworks, transaction preparation and counterparty diligence coordination.'},
    'gold-trade.html': {'path': '/gold-trade.html', 'title': 'Responsible Gold Trade & Buyer Screening | OOME Minerals | Ghana', 'description': 'A controlled B2B pathway for qualified gold-trade counterparties, responsible sourcing and buyer screening from Accra, Ghana.'},
    'team.html': {'path': '/team.html', 'title': 'Accountable Minerals Expertise | The Team | OOME Minerals', 'description': 'OOME Minerals is built around accountable commercial, compliance and transaction-execution roles for Ghanaian mining and responsible gold-trade engagement.'},
    'contact.html': {'path': '/contact.html', 'title': 'Contact OOME Minerals | Mining & Gold-Trade Enquiries | Accra, Ghana', 'description': 'Submit a professional enquiry to OOME Minerals concerning mining consultancy, responsible sourcing, qualified buyer engagement or industry partnerships.'}
}
for filename, data in pages.items():
    path = root / filename
    source = path.read_text()
    source = re.sub(r'<title>.*?</title>', f'<title>{data["title"]}</title>', source, count=1)
    if data.get('h1'):
        source = source.replace('<h1>Mineral intelligence.<br><em>Trade discipline.</em></h1>', f'<h1>{data["h1"]}</h1>')
    url = base + data['path']
    meta = (
        f'<meta name="description" content="{data["description"]}">'
        f'<meta name="robots" content="index,follow">'
        f'<link rel="canonical" href="{url}">'
        f'<meta property="og:type" content="website">'
        f'<meta property="og:site_name" content="OOME Minerals">'
        f'<meta property="og:title" content="{data["title"]}">'
        f'<meta property="og:description" content="{data["description"]}">'
        f'<meta property="og:url" content="{url}">'
        f'<meta property="og:image" content="{base}/assets/oome-og-image.jpg">'
        f'<meta property="og:image:width" content="1200">'
        f'<meta property="og:image:height" content="630">'
        f'<meta property="og:locale" content="en_GB">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{data["title"]}">'
        f'<meta name="twitter:description" content="{data["description"]}">'
        f'<meta name="twitter:image" content="{base}/assets/oome-og-image.jpg">'
        f'<link rel="icon" type="image/png" href="assets/favicon-32.png">'
        f'<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">'
        f'<link rel="manifest" href="site.webmanifest">'
        + data.get('schema', '')
    )
    path.write_text(source.replace('</head>', meta + '</head>', 1))
print('Updated SEO metadata and structured data for five public pages.')
