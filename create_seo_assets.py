from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

assets = Path('/root/projects/oome-minerals-site/assets')
hero = Image.open(assets / 'oome-hero-mineral.png').convert('RGB').resize((1200, 630))
overlay = Image.new('RGBA', hero.size, (0, 0, 0, 0))
d = ImageDraw.Draw(overlay)
d.rectangle((0, 0, 1200, 630), fill=(5, 5, 4, 170))
d.rectangle((0, 390, 1200, 630), fill=(5, 5, 4, 130))
hero = Image.alpha_composite(hero.convert('RGBA'), overlay)
d = ImageDraw.Draw(hero)
serif = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
sans = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
serif_bold = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
gold = (220, 200, 148, 255)
paper = (246, 244, 238, 255)
muted = (213, 208, 196, 255)
d.text((70, 72), 'OOME MINERALS', font=ImageFont.truetype(sans, 22), fill=gold, spacing=4)
d.line((70, 112, 340, 112), fill=(179, 138, 52, 220), width=2)
d.multiline_text((70, 205), 'Mining consultancy.\nResponsible gold trade.', font=ImageFont.truetype(serif_bold, 56), fill=paper, spacing=4)
d.text((73, 420), 'ACCRA, GHANA  ·  GHANAIAN MINERAL EXPERTISE. INTERNATIONAL TRADE DISCIPLINE.', font=ImageFont.truetype(sans, 16), fill=muted)
hero.convert('RGB').save(assets / 'oome-og-image.jpg', quality=92, optimize=True)

# Brand-safe square icons: a restrained gold O on black.
for size, name in [(32,'favicon-32.png'), (180,'apple-touch-icon.png'), (192,'icon-192.png'), (512,'icon-512.png')]:
    icon=Image.new('RGB',(size,size),(8,8,8))
    draw=ImageDraw.Draw(icon)
    margin=max(3, size//10)
    draw.rounded_rectangle((margin,margin,size-margin,size-margin), radius=size//7, outline=(179,138,52), width=max(1,size//32))
    f=ImageFont.truetype(serif, max(12, int(size*.56)))
    box=draw.textbbox((0,0),'O',font=f)
    draw.text(((size-(box[2]-box[0]))/2,(size-(box[3]-box[1]))/2-box[1]),'O',font=f,fill=(225,205,153))
    icon.save(assets/name)
print('Created Open Graph and icon assets.')
