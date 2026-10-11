#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""史间 · 场景图生成器
生成 12 个通用场景 SVG（img/scenes/*.svg），供时空连线的 bg.img 使用。
设计约束：与 bg.grad 同色调叠加、极简剪影、零外部依赖、单文件 <2KB。
用法：python3 scripts/gen_scenes.py  （重复运行安全，幂等覆盖）"""
import os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'img', 'scenes')

# 每个场景：(天空渐变上, 天空渐变下, 远景剪影色, 近景剪影色, 元素函数名)
def esc(c): return c

def svg_wrap(w, h, top, bot, far, near, body, stars=True, moon=None):
    star = ''
    if stars:
        import random
        rnd = random.Random(7)
        pts = [tuple(map(int, p.split(','))) for p in
               [f'{rnd.randint(10,365)},{rnd.randint(8,90)}' for _ in range(26)]]
        star = '<g fill="#fff" opacity=".5">' + ''.join(
            f'<circle cx="{x}" cy="{y}" r="{0.6 if i % 3 else 1.0}"/>'
            for i, (x, y) in enumerate(pts)) + '</g>'
    m = ''
    if moon:
        m = (f'<circle cx="{moon[0]}" cy="{moon[1]}" r="{moon[2]}" fill="#f5e9c8" opacity=".9"/>'
             f'<circle cx="{moon[0]+8}" cy="{moon[1]-6}" r="{moon[2]-1}" fill="{top}" opacity=".25"/>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 250" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bot}"/></linearGradient></defs>
<rect width="375" height="250" fill="url(#sky)"/>{star}{m}
{body}</svg>'''

def ridge(points, color, opacity=1.0):
    return f'<polygon points="{points}" fill="{color}" opacity="{opacity}"/>'

SCENES = {}

def scene(key):
    def deco(f): SCENES[key] = f; return f
    return deco

# —— 1 月夜江山：项羽乌江 / 司马迁夜 ——
@scene('moon')
def s_moon():
    body = (
        ridge('0,168 60,120 120,158 190,96 260,150 330,110 375,150 375,250 0,250', '#0d1420', .9) +
        ridge('0,196 80,160 170,190 250,150 375,188 375,250 0,250', '#0a1017') +
        '<g stroke="#5d7a96" stroke-width="1.1" opacity=".55" fill="none">' +
        ''.join(f'<path d="M0,{210+i*9} q60,-6 120,0 t120,0 t135,0"/>' for i in range(5)) + '</g>' +
        '<path d="M186,214 l0,-26 l10,26 z" fill="#0a1017"/><path d="M196,214 l0,-18 l8,18 z" fill="#0a1017"/>'
    )
    return svg_wrap(375, 250, '#16202e', '#22374d', '#0d1420', '#0a1017', body, moon=(300, 52, 22))

# —— 2 军帐灯影：巨鹿 / 五丈原 / 边塞 ——
@scene('tent')
def s_tent():
    body = (
        ridge('0,150 90,110 180,148 280,104 375,146 375,250 0,250', '#131a22', .85) +
        '<path d="M120,190 L187,108 L254,190 Z" fill="#1d2630"/>' +
        '<path d="M150,190 L187,132 L224,190 Z" fill="#e8b64c" opacity=".55"/>' +
        '<path d="M120,190 L187,108 L254,190" fill="none" stroke="#0a0f14" stroke-width="3"/>' +
        '<path d="M168,196 l0,34 M206,196 l0,34" stroke="#0a0f14" stroke-width="2.4"/>' +
        '<path d="M30,220 q14,-30 28,0 z" fill="#0e141b"/><path d="M330,224 q12,-26 24,0 z" fill="#0e141b"/>' +
        '<g opacity=".7" fill="#e8b64c"><circle cx="187" cy="176" r="2.6"/><circle cx="187" cy="188" r="1.8"/></g>'
    )
    return svg_wrap(375, 250, '#141b26', '#243244', '#131a22', '#0a0f14', body, stars=False, moon=(44, 46, 14))

# —— 3 易水风雪：荆轲 / 诀别 ——
@scene('snow')
def s_snow():
    import random
    rnd = random.Random(11)
    flakes = ' '.join(f'{rnd.randint(0,375)},{rnd.randint(0,250)}' for _ in range(70))
    body = (
        ridge('0,172 70,128 150,166 240,118 320,160 375,132 375,250 0,250', '#1a2230', .8) +
        ridge('0,205 100,178 210,202 300,176 375,198 375,250 0,250', '#10161f') +
        '<g fill="#dfe8f2" opacity=".8">' + ''.join(
            f'<circle cx="{x}" cy="{y}" r="{rnd.choice([1.1,1.6,2.0])}"/>' for x, y in
            [tuple(map(int, p.split(','))) for p in flakes.split()]) + '</g>' +
        '<path d="M186,206 l-6,-30 l12,0 z" fill="#0a0f14"/><path d="M180,214 l12,0" stroke="#0a0f14" stroke-width="2.6"/>' +
        '<path d="M196,206 l10,-8 M204,212 l12,-10" stroke="#0a0f14" stroke-width="2.2"/>'
    )
    return svg_wrap(375, 250, '#1b2433', '#31435a', '#1a2230', '#10161f', body, stars=False)

# —— 4 渡水舟行：乌江 / 白帝 / 归途 ——
@scene('river')
def s_river():
    body = (
        ridge('0,158 80,126 170,156 260,120 340,152 375,136 375,250 0,250', '#141d29', .85) +
        ridge('0,192 110,168 230,190 375,170 375,250 0,250', '#0d141d') +
        '<g stroke="#7d97b0" stroke-width="1.2" opacity=".5" fill="none">' +
        ''.join(f'<path d="M0,{196+i*11} q70,-7 140,0 t130,0 t105,0"/>' for i in range(5)) + '</g>' +
        '<path d="M140,196 q40,16 95,10 l-8,20 q-55,6 -92,-8 z" fill="#231d16"/>' +
        '<path d="M187,196 l0,-44" stroke="#231d16" stroke-width="2.6"/>' +
        '<path d="M189,154 q22,14 0,30 q-22,-16 0,-30" fill="#c9d6e2" opacity=".85"/>'
    )
    return svg_wrap(375, 250, '#151e2b', '#26384c', '#141d29', '#0d141d', body, moon=(318, 44, 18))

# —— 5 灯下书案：司马迁 / 黄庭坚 ——
@scene('lamp')
def s_lamp():
    body = (
        '<rect x="0" y="150" width="375" height="100" fill="#16120c"/>' +
        '<rect x="30" y="150" width="315" height="100" fill="#1c1710"/>' +
        '<g stroke="#2e2818" stroke-width="1.4">' +
        ''.join(f'<path d="M0,{y} H375"/>' for y in (172, 196, 220, 244)) + '</g>' +
        '<rect x="150" y="92" width="76" height="58" rx="4" fill="#2b2415"/>' +
        '<rect x="160" y="100" width="56" height="42" fill="#f0c86a" opacity=".9"/>' +
        '<path d="M188,100 q-14,-26 6,-38 q4,18 12,22 q-10,6 -18,16" fill="#f5d98a"/>' +
        '<ellipse cx="188" cy="150" rx="86" ry="26" fill="#f0c86a" opacity=".14"/>' +
        '<rect x="238" y="132" width="92" height="14" rx="3" fill="#3a3020"/>' +
        '<g stroke="#5a4c30" stroke-width="1.2">' + ''.join(f'<path d="M{240+i*7},132 l0,14"/>' for i in range(13)) + '</g>'
    )
    return svg_wrap(375, 250, '#191410', '#241c12', '#16120c', '#100d09', body, stars=False)

# —— 6 城门官道：长安 / 大泽乡 / 出蜀 ——
@scene('gate')
def s_gate():
    body = (
        '<rect x="52" y="86" width="46" height="164" fill="#221a14"/>' +
        '<rect x="277" y="86" width="46" height="164" fill="#221a14"/>' +
        '<path d="M40,86 L98,44 L98,86 Z" fill="#2e2218"/>' +
        '<path d="M277,86 L335,44 L335,86 Z" fill="#2e2218"/>' +
        '<rect x="98" y="60" width="179" height="22" fill="#3a2c1e"/>' +
        '<rect x="150" y="82" width="76" height="34" fill="#c9a05a" opacity=".5"/>' +
        '<rect x="46" y="196" width="283" height="10" fill="#171009"/>' +
        '<path d="M0,226 H375" stroke="#3a2c1e" stroke-width="10"/>' +
        '<path d="M60,214 q30,-14 60,0 M255,214 q30,-14 60,0" stroke="#3a2c1e" stroke-width="3" fill="none"/>'
    )
    return svg_wrap(375, 250, '#1d1710', '#33291c', '#221a14', '#171009', body, stars=False, moon=(306, 50, 15))

# —— 7 田园篱菊：陶渊明 ——
@scene('field')
def s_field():
    body = (
        ridge('0,120 90,84 180,116 275,78 375,112 375,250 0,250', '#1a2418', .8) +
        ridge('0,158 120,132 240,158 375,134 375,250 0,250', '#131c12') +
        '<g stroke="#0e150d" stroke-width="2.4">' +
        ''.join(f'<path d="M{x},206 l0,-34 M{x},196 l-9,-10 M{x},196 l9,-10"/>' for x in range(24, 375, 26)) + '</g>' +
        '<g fill="#e8b64c"><circle cx="44" cy="168" r="3.4"/><circle cx="122" cy="162" r="3"/>' +
        '<circle cx="238" cy="160" r="3.4"/><circle cx="330" cy="164" r="3"/></g>' +
        '<ellipse cx="188" cy="216" rx="150" ry="16" fill="#0e150d" opacity=".8"/>'
    )
    return svg_wrap(375, 250, '#161f14', '#2b3a24', '#1a2418', '#0e150d', body, moon=(52, 48, 16))

# —— 8 朝堂宫殿：称帝 / 渑池 / 廷议 ——
@scene('court')
def s_court():
    body = (
        '<path d="M20,120 L187,58 L354,120 Z" fill="#2a2118"/>' +
        '<rect x="40" y="120" width="294" height="10" fill="#241c14"/>' +
        '<g fill="#1f1810">' + ''.join(f'<rect x="{52+i*44}" y="130" width="20" height="120"/>' for i in range(7)) + '</g>' +
        '<rect x="160" y="170" width="54" height="80" fill="#c9a05a" opacity=".45"/>' +
        '<rect x="0" y="212" width="375" height="38" fill="#17110b"/>' +
        '<path d="M0,224 H375" stroke="#2a2118" stroke-width="3"/>'
    )
    return svg_wrap(375, 250, '#1c1610', '#2e2417', '#2a2118', '#17110b', body, stars=False)

# —— 9 高台：怀沙 / 登高 ——
@scene('terrace')
def s_terrace():
    body = (
        ridge('0,140 100,104 200,138 300,100 375,132 375,250 0,250', '#1a222c', .8) +
        ridge('0,182 130,158 260,180 375,162 375,250 0,250', '#101620') +
        '<rect x="96" y="176" width="183" height="14" fill="#241d15"/>' +
        '<g fill="#241d15">' + ''.join(f'<rect x="{108+i*40}" y="190" width="9" height="30"/>' for i in range(5)) + '</g>' +
        '<path d="M168,176 l0,-40 M206,176 l0,-40 M168,136 l38,0" stroke="#241d15" stroke-width="3" fill="none"/>' +
        '<path d="M155,136 l30,-24 l30,24" stroke="#241d15" stroke-width="3" fill="none"/>' +
        '<ellipse cx="188" cy="228" rx="150" ry="12" fill="#0c121a" opacity=".9"/>'
    )
    return svg_wrap(375, 250, '#161d27', '#2a3644', '#1a222c', '#101620', body, moon=(300, 44, 20))

# —— 10 江船夜泊：赤壁 / 石壕 / 石壕村夜 ——
@scene('boat')
def s_boat():
    body = (
        ridge('0,150 90,116 180,148 280,110 375,144 375,250 0,250', '#131b26', .85) +
        ridge('0,190 120,166 240,188 375,168 375,250 0,250', '#0c131b') +
        '<g stroke="#6d87a0" stroke-width="1.2" opacity=".5" fill="none">' +
        ''.join(f'<path d="M0,{196+i*11} q80,-7 160,0 t150,0 t65,0"/>' for i in range(4)) + '</g>' +
        '<path d="M110,196 q70,22 155,12 l-10,26 q-85,10 -150,-12 z" fill="#221b13"/>' +
        '<path d="M150,196 l0,-30 l34,0 l0,30" fill="#221b13"/>' +
        '<rect x="158" y="168" width="18" height="14" fill="#e8b64c" opacity=".65"/>' +
        '<path d="M300,196 q-6,-30 6,-46 q12,16 6,46" fill="#221b13"/>'
    )
    return svg_wrap(375, 250, '#131a25', '#22303f', '#131b26', '#0c131b', body, moon=(46, 46, 18))

# —— 11 窗棂月色：李清照 ——
@scene('window')
def s_window():
    body = (
        '<rect x="0" y="0" width="375" height="250" fill="#241d18"/>' +
        '<rect x="96" y="30" width="183" height="140" rx="3" fill="#2e2620"/>' +
        '<rect x="104" y="38" width="167" height="124" fill="#3b4a5c"/>' +
        '<circle cx="200" cy="86" r="20" fill="#f2e3b6" opacity=".95"/>' +
        '<g stroke="#241d18" stroke-width="7">' +
        '<path d="M187,38 l0,162 M104,100 l167,0"/></g>' +
        '<rect x="0" y="196" width="375" height="54" fill="#1d1712"/>' +
        '<rect x="150" y="206" width="76" height="40" rx="3" fill="#2b2219"/>' +
        '<ellipse cx="188" cy="204" rx="60" ry="8" fill="#f2e3b6" opacity=".1"/>' +
        '<path d="M52,196 q10,-34 20,0 z" fill="#171310"/><path d="M312,196 q10,-30 20,0 z" fill="#171310"/>'
    )
    return svg_wrap(375, 250, '#241d18', '#3b4a5c', '#241d18', '#1d1712', body, stars=False)

# —— 12 山道竹杖：半山 / 归鲁 ——
@scene('ridge')
def s_ridge():
    body = (
        ridge('0,130 70,92 150,126 230,86 320,122 375,96 375,250 0,250', '#1b2419', .8) +
        ridge('0,170 110,142 220,168 320,140 375,158 375,250 0,250', '#121a11') +
        '<path d="M40,250 q90,-60 160,-30 q60,26 140,-14 l0,44 z" fill="#0d140c"/>' +
        '<g stroke="#0a1009" stroke-width="2.2">' +
        ''.join(f'<path d="M{x},228 l0,-40 M{x},214 l-8,-9 M{x},214 l8,-9"/>' for x in range(30, 375, 34)) + '</g>' +
        '<path d="M186,226 l0,-30 M186,206 l-12,-8 M186,206 l12,-8" stroke="#0a1009" stroke-width="2.4"/>'
    )
    return svg_wrap(375, 250, '#16200f', '#2c3a22', '#1b2419', '#0d140c', body, moon=(318, 46, 17))

def main():
    os.makedirs(OUT, exist_ok=True)
    for key, fn in SCENES.items():
        p = os.path.join(OUT, key + '.svg')
        with open(p, 'w', encoding='utf-8') as f:
            f.write(fn())
        print('scene:', key, os.path.getsize(p), 'bytes')
    print('total:', len(SCENES))

if __name__ == '__main__':
    main()
