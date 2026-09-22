"""Convert the three OFL-licensed Noto CJK glyphs into Three.js font outlines.
Usage: python build-name-font.py NotoSansCJKkr-Black.otf output.json
Requires fonttools. The output is a modified subset, not the original font.
"""
import json, sys
import pathops
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
class ThreePen(BasePen):
    def __init__(self, glyphset):
        super().__init__(glyphset); self.commands=[]; self.start=None
    def emit(self, op, *points):
        self.commands.append(op+' '+' '.join(str(round(v,3)) for p in points for v in p))
    def _moveTo(self,p): self.start=p; self.emit('m',p)
    def _lineTo(self,p): self.emit('l',p)
    def _curveToOne(self,a,b,c): self.emit('b',c,a,b)
    def _qCurveToOne(self,a,b): self.emit('q',b,a)
    def _closePath(self): self.emit('l',self.start)
f=TTFont(sys.argv[1]); gs=f.getGlyphSet(); cmap=f.getBestCmap(); glyphs={}
for char in '文讚美':
    name=cmap[ord(char)]; pen=ThreePen(gs)
    raw=pathops.Path(); gs[name].draw(raw.getPen())
    # Resolve overlapping contours and normalize outside/inside winding for Three.js.
    clean=pathops.simplify(raw, clockwise=True)
    clean.draw(pen)
    glyphs[char]={'ha':f['hmtx'][name][0], 'x_min':0,'x_max':1000,'o':' '.join(pen.commands)}
result={'glyphs':glyphs,'familyName':'Moon Chrome Name Subset','resolution':f['head'].unitsPerEm,'boundingBox':{'yMin':-120,'yMax':1050},'underlineThickness':50,'original_font_information':{'source':'NotoSansCJKkr-Black, OFL-1.1; modified three-character outline subset'}}
with open(sys.argv[2],'w') as out: json.dump(result,out,ensure_ascii=False)
print('Created outlines:', ', '.join(glyphs))
