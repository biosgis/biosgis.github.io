# README file for Delta Maps #

20170731 dchiang 20170921

---------------------------------
## 20-mm Fish Distribution Map ##

### bd20mmlet.html

* Built on Esri Leaflet API
* Latest v20170921



-------------------------------
## Spring Kodiak Trawl Map ##

### sktmaplet.html

* Built on Esri Leaflet API
* Latest v20170831

function piemarker(arr, lat, lon)

In SVG space of default size pie circle 100x100,
center would be at (50,50),
compass rotation starting at top with degree zero would have the x-y coordinates
0-deg = 50,0; 90-deg = 100,50; 180-deg = 50,100; 270-deg = 0,50;

function piecut(ang, degfrom, lx, ly, r)

Input Parameters
- ang: angle of the slice
- degfrom: degree on circle of starting point
- lx: line-to x-coordinate on circle of the arc starting point
- ly: line-to y-coordinate on crcle of the arc starting point
- r: radius of circle; center coordinate of circle for starting line to the starting point of arc on circle.

Figuring out the correct arc parameters is hardest
1 0 0
1 1 0
1 1 1
0 1 1
0 0 1
0 1 0

Returns [degto, ax, ay, d] where
- degto: degree on circle to the arc ending point.
- ax: arc-to x-coordinate of the arc ending point.
- ay: arc-to y-coordinate of the arc ending point.
- d: SVG Path parameter d that describe the path of the slice of pie.

function testtrig()

This function test the different dx and dy values from sine and cosine of the angle
of sweep of the pie slice, so we can map it to a conversion function from
trigonometric circle positions to graphic coordinates in SVG space.

Output (for r = 100):
<pre>
deg=0, dx=100, dy=0; f(0)=[100, 0]
deg=15, dx=97, dy=26; f(15)=[97, 26]
deg=30, dx=87, dy=50; f(30)=[87, 50]
deg=45, dx=71, dy=71; f(45)=[71, 71]
deg=60, dx=50, dy=87; f(60)=[50, 87]
deg=90, dx=0, dy=100; f(90)=[0, 100]
deg=120, dx=-50, dy=87; f(120)=[-50, 87]
deg=135, dx=-71, dy=71; f(135)=[-71, 71]
deg=180, dx=-100, dy=0; f(180)=[-100, 0]
deg=225, dx=-71, dy=-71; f(225)=[-71, -71]
deg=240, dx=-50, dy=-87; f(240)=[-50, -87]
deg=270, dx=0, dy=-100; f(270)=[0, -100]
deg=315, dx=71, dy=-71; f(315)=[71, -71]
deg=330, dx=87, dy=-50; f(330)=[87, -50]
deg=360, dx=100, dy=0; f(360)=[100, 0]
</pre>
This translates to zero (360) degree starting due East and
sweeping counter-clockwise so 90 degrees is at top North position,
180 due West, and 270 due South.

For a user friendly circle starting zero degree at top due North
and sweeps clockwise
<pre>
Let bearing starts at top (North) and sweeps clockwise:
deg=0, dx=100, dy=0; f(0)=[100, 0] => g(100, 0): x = r + dy; y = r - dx;
deg=15, dx=97, dy=26; f(15)=[97, 26] => g(126,3): x = r + dy; y = r - dx;
deg=30, dx=87, dy=50; f(30)=[87, 50] => g(150, 13): x = r + dy; y = r - dx;
deg=45, dx=71, dy=71; f(45)=[71, 71] => g(171, 29): x = r + dy; y = r - dx;
deg=60, dx=50, dy=87; f(60)=[50, 87] => g(187, 50): x = r + dy; y = r - dx;
deg=90, dx=0, dy=100; f(90)=[0, 100] => g(200, 100): x = r + dy; y = r - dx;
deg=120, dx=-50, dy=87; f(120)=[-50, 87]
deg=135, dx=-71, dy=71; f(135)=[-71, 71]
deg=180, dx=-100, dy=0; f(180)=[-100, 0]
deg=225, dx=-71, dy=-71; f(225)=[-71, -71]
deg=240, dx=-50, dy=-87; f(240)=[-50, -87]
deg=270, dx=0, dy=-100; f(270)=[0, -100]
deg=315, dx=71, dy=-71; f(315)=[71, -71]
deg=330, dx=87, dy=-50; f(330)=[87, -50]
deg=360, dx=100, dy=0; f(360)=[100, 0]
</pre>


-------------------
## Leaflet TIPS ##

1. Set a L.layerGroup to a global variable like olayer and remove it from the map with
<code>map.removeLayer(olayer)</code>


