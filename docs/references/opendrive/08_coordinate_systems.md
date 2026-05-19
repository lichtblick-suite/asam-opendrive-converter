> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 8 Coordinate systems

## 8.1 Introduction to coordinate systems

ASAM OpenDRIVE uses three types of coordinate systems:

- The inertial x/y/z coordinate system
- The road reference line s/t/h coordinate system
- The local u/v/z coordinate system

![img](../_images/08_coordinate_systems/coo_sys_overview.png)

Figure 7. Available coordinate systems in ASAM OpenDRIVE

[Figure 7](#fig-67a7a638-8746-44f4-a574-e05908306350) shows the three coordinate systems.

These coordinate systems may interact with each other, if present.

![img](../_images/08_coordinate_systems/coo_sys_interact.png)

Figure 8. Coordinate systems in ASAM OpenDRIVE interacting with another

[Figure 8](#fig-ecaff823-8bfa-4c03-b660-f7cc5873e843) shows how the three coordinate systems interact with each other and with respect to the road reference line. If not indicated otherwise, the local coordinate system is located and oriented relative to the road reference line coordinate system. The road reference line coordinate system is located and oriented relative to the inertial coordinate system by specifying the origin, as well as the heading, roll, and pitch rotation angles of the origins with respect to each other.

![img](../_images/08_coordinate_systems/coo_sys_all_2.png)

Figure 9. Summary of coordinate system in ASAM OpenDRIVE

[Figure 9](#fig-9e277ae1-6e3d-4c60-b06e-839d1a0b2d75) shows an example for positioning and orientation of the different coordinate systems relative to each other from another perspective.

> **Note** Note that the local u/v/z coordinate system’s origin is located at the elevation at this position.

![img](../_images/08_coordinate_systems/coo_sys_s-t-road-based.drawio.svg)

Figure 10. Reference-line-based s/t-coordinate system with origin at the beginning of the road

[Figure 10](#fig-c28e3855-aebe-46c3-92df-f9e40a4bf616) shows the road-based coordinate system that consists of two coordinate axes associated with the reference line of the corresponding road (s-axis) and the direction orthogonal to it (t-axis) and pointing leftwards.

## 8.2 Inertial coordinate systems

The inertial system is a right-handed coordinate system according to ISO 8855 [[6](../bibliography.html#bib-iso8855)] with the axes pointing to the following directions (see [Figure 11](#fig-6f953b3f-be4e-41cc-b7c0-6cf0f8937967)):

- x ⇒ right
- y ⇒ up
- z ⇒ coming out of drawing plane

For geographic reference, the following convention applies:

- x ⇒ east
- y ⇒ north
- z ⇒ up

Elements like objects and signals can be placed within the inertial coordinate system by applying a heading, followed by pitch, followed by roll:

![img](../_images/08_coordinate_systems/coo_sys_inertial.png)

Figure 11. Inertial coordinate system with defined rotations

[Figure 11](#fig-6f953b3f-be4e-41cc-b7c0-6cf0f8937967) shows the positive axes and positive directions of the corresponding angles.

|  |  |
| --- | --- |
| heading<br>heading = 0.0:<br>heading = +π/2: | around z-axis, where<br>x’ points into direction of x-axis / east<br>x’ points into direction of y-axis / north |
| pitch<br>pitch = 0.0:<br>pitch = +π/2: | around y’-axis, where<br>x’’/y’’ plane = x’/y’ plane<br>direction x’’ = - z’ = -z |
| roll<br>roll = 0.0:<br>roll = +π/2: | around x’’-axis, where<br>x’’’/y’’’ plane = x’’/y’’ plane<br>direction z’’’ = - y’’ |

![img](../_images/08_coordinate_systems/coo_sys_inertial_example.png)

Figure 12. Inertial coordinate system with defined rotations

[Figure 12](#fig-5d482d32-897e-4755-9439-f4740961192a) shows the different states of an inertial coordinate system with defined rotations. x’/y’/(z’=z) denotes the coordinate system after rotating x/y/z with the heading angle around the z-axis. The coordinate system x’’/(y’’=y’)/z’’ denotes the coordinate system after rotating x’/y’/z’ with the pitch angle around the y’-axis. The final rotated coordinate system (x’’’=x’’)/y’’’/z’’’ is obtained after rotating system x’’/y’’/z’’ with roll angle.

## 8.3 Road reference line coordinate systems

The road reference line is always located within the x/y plane defined by the inertial coordinate system. A road reference line coordinate system runs along the road reference line. It is a right-handed coordinate system. The s-axis follows the tangent of the road reference line. The t-axis is orthogonal to the s-axis and may be rotated around the s-axis by superelevation. The right-handed coordinate system is completed by defining the up-direction `h` orthogonal to s-axis and t-axis.

![img](../_images/08_coordinate_systems/ref_line_sys.png)

Figure 13. Road reference line coordinate system

[Figure 13](#fig-eb7c93c8-4980-4c6a-ac98-f6c8734c56a6) shows the degrees of freedom defined for the road reference line coordinate system.

The following degrees of freedom are defined:

|  |  |
| --- | --- |
| s | coordinate along road reference line, measured in [m] from the beginning of the road reference line, calculated in the x/y plane (that is, not taking into account the elevation profile of the road) |
| t | lateral position, perpendicular to the road reference line and angled relative to the x/y plane according to the road superelevation. Positive to the left of the road reference line. |
| h | orthogonal to s/t plane in a right-handed coordinate system |
| heading | rotation around h-axis |
| superelevation | rotation around s-axis |

![img](../_images/08_coordinate_systems/ref_line_sys_rot.png)

Figure 14. Road reference line coordinate system with defined rotations

[Figure 14](#fig-cb64f5fc-c581-4868-81f6-de9a964893a6) shows the different states of a road reference line coordinate system with defined rotations.

Similar to the inertial coordinate system, the s’/t’/h’ and s<sub>superelevation</sub>/t<sub>superelevation</sub>/h<sub>superelevation</sub> denote the rotated coordinate systems around heading and superelevation angle.

![img](../_images/08_coordinate_systems/ref_line_sys_heading.png)

Figure 15. Heading in road reference line

[Figure 15](#fig-fdc5b5f7-13f2-4063-b3eb-eaa8c36e79f9) shows how the road reference line coordinate system can be positioned in the inertial space by providing the origin’s coordinates and the orientation (heading) of the origin with respect to the inertial coordinate system.

![img](../_images/08_coordinate_systems/ref_line_sys_superele.png)

Figure 16. Roll in road reference line by superelevation

[Figure 16](#fig-5ba9fa4a-ae86-4bd0-a566-ec4336bc21a5) shows how superelevation causes a roll in the road reference line. Values of t are measured in the superelevated lane. The value of the @width attribute of the lane does not change if superelevation is applied. The projected width in the x/y plane is different to the width of the superelevated lane.

![img](../_images/08_coordinate_systems/ref_line_sys_ele.png)

Figure 17. Elevation in road reference line

[Figure 17](#fig-92f8e3fe-a832-4696-a0cf-5de31cc54dfa) shows the elevation for road reference line coordinate systems. For the s/t/h coordinate system no pitch is possible. Elevation has no effect on the length of s.

> **Note** In ASAM OpenDRIVE, objects and signals are placed in their own s/t-coordinate system and are not rotated by superelevation, they specify their position relative to the road reference line and then can be rotated individually. Their @t attribute is rotated with the lane affected only by superelevation, so an object or signal placed at the border of a lane stays at this border regardless of superelevation or not. Their @zOffset attribute is calculated in z-direction, a value of `0` means the object or signal is placed at the local elevation at this s-position. In order to place the object or signal on the road surface and take the superelevation into account, the @zOffset attribute has to match the height offset caused by the superelevation at this position.

## 8.4 Local coordinate systems

The local coordinate system is a right-handed coordinate system according to ISO 8855 with the axes pointing to the following directions. For a non-rotated coordinate system the following applies:

|  |  |
| --- | --- |
| u | Forward matches s |
| v | Left matches t |
| z | Up matches h |

![img](../_images/08_coordinate_systems/coo_sys_local.png)

Figure 18. Local coordinate system with defined rotations

[Figure 18](#fig-3ce150eb-1dee-4380-94ac-e9021e56f35b) shows the positive axes and positive directions of the corresponding angles and how elements, such as objects, can be placed within the local coordinate system by applying a heading, followed by pitch, followed by roll.

Within the local coordinate system, the following angles are defined:

|  |  |
| --- | --- |
| heading | around z-axis, 0.0 = east |
| heading = 0.0: | u’ is directed forward along u-direction |
| heading = +π/2: | u’ is directed to t |
|  |  |
| pitch | around v’-axis, where |
| pitch = 0.0: | u’’/v’’ plane = u’/v’ plane |
|  |  |
| roll | around u’’-axis, where |
| roll = 0.0: | u’’’/v’’’ plane = u’’/v’’ plane |

![img](../_images/08_coordinate_systems/coo_sys_local_example.png)

Figure 19. Local coordinate systems with heading, pitch, roll

[Figure 19](#fig-70e4801c-e784-460a-87f6-4633bca1efd8) shows how heading, pitch, and roll are applied to the local coordinate system.

![img](../_images/08_coordinate_systems/coo_sys_all_1.png)

Figure 20. Local coordinate system with respect to road reference line coordinate system

[Figure 20](#fig-fa173c34-aff9-4df6-944a-16cfdfa5a567) shows how the local coordinate system can only be positioned in road reference line space by providing the origin of the local coordinate system within the road reference line coordinate system and the orientation (heading) of the local coordinate system with respect to the road reference line coordinate system.

## 8.5 Georeferencing

Spatial reference systems are standardized by the European Petroleum Survey Group Geodesy (EPSG:32632 WGS 84 / UTM zone 32N [[16](../bibliography.html#bib-epsg32632)]) and are defined by parameters describing the geodetic datum. A geodetic datum is a coordinate reference system for a collection of positions that are relative to an ellipsoid model of the earth.

A geodetic datum is described by a projection string according to PROJ, that is, a format for the exchange of data between two coordinate systems. This data shall be marked as CDATA, because it may contain characters that interfere with the XML syntax of an element’s attribute.

![img](../_images/08_coordinate_systems/geo_ref.png)

Figure 21. geoReference and offset

[Figure 21](#fig-575a3505-1d2b-4cbc-b940-c42454b4ff8e) shows the relation between ASAM OpenDRIVE coordinates and geo referenced data. The used spatial reference system is defined by PROJ-strings. For detailed information on PROJ-strings see the documentation of the *PROJ coordinate transformation software library* [[17](../bibliography.html#bib-PROJ_2023)].

It is highly recommended to use official parameter sets for PROJ-strings that can be found at *EPSG.io* [[18](../bibliography.html#bib-epsgio)]. Parameters should not be changed. Some spatial reference systems, for example, UTM, have implicit false easting and northing that are defined using the parameters `+x_0` and `+y_0`.

To apply an offset, use the `<offset>` element instead of changing parameter values of a projection definition because overwriting existing definitions may lead to unexpected behavior. Alternatively define a custom projection using Transverse Mercator (TM).

If an offset exists, always apply the offset on the local ASAM OpenDRIVE coordinates to get the world coordinates before converting the positions using PROJ.

The offset is applied on an ASAM OpenDRIVE instance using an Affine Transformation with rotation around z-axis:

xWorld = xODR * cos(hdg) - yODR * sin(hdg) + xOffset

yWorld = xODR * sin(hdg) + yODR * cos(hdg) + yOffset

zWorld = zODR + zOffset

If no heading is supplied (recommended), the formulas simplify to:

xWorld = xODR + xOffset

yWorld = yODR + yOffset

zWorld = zODR + zOffset

**Elements in UML model**

**`<geoReference>` element**

In ASAM OpenDRIVE, the information about the geographic reference of an ASAM OpenDRIVE dataset is represented by the `<geoReference>` element within the `<header>` element.

UML class: t_header_GeoReference
XML tag:   <geoReference> (Multiplicity: 0..1)

Spatial reference systems are standardized by the European Petroleum Survey Group Geodesy (EPSG) and are defined by parameters describing the geodetic datum. A geodetic datum is a coordinate reference system for a collection of positions that are relative to an ellipsoid model of the earth.

A geodetic datum is described by a projection string according to PROJ, that is, a format for the exchange of data between two coordinate systems. This data shall be marked as CDATA, because it may contain characters that interfere with the XML syntax of an element’s attribute.

**`<offset>` element**

In ASAM OpenDRIVE, the offset of a database is represented by the `<offset>` element within the `<header>` element.

UML class: t_header_Offset
XML tag:   <offset> (Multiplicity: 0..1)

To avoid large coordinates, an offset of the whole dataset may be applied using the `<offset>` element. It enables inertial relocation and re-orientation of datasets. The dataset is first translated by @x, @y, and @z. Afterwards, it is rotated by @hdg around the new origin. Rotation around the z-axis should be avoided.

Table 17. Attributes of the <offset> element
| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `hdg` | double | required | rad | Heading offset (rotation around resulting z-axis) |
| `x` | double | required | m | Inertial x offset |
| `y` | double | required | m | Inertial y offset |
| `z` | double | required | m | Inertial z offset |

**XML example**

```xml
<geoReference>
    <![CDATA[+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs]]>
</geoReference>
```

**Rules**

- There shall be no more than one definition of the projection. If the definition is missing, a local Cartesian coordinate system is assumed.

- [asam.net:xodr:1.7.0:header.offset.centered_coords](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-header-offset-centered-coords): The `<offset>` element should be such that the x and y coordinates of ASAM OpenDRIVE are approximately centered around (0;0). If the x and y coordinates are too large, applications using float coordinates internally might not be able to process them accurately enough due to the limited precision of IEEE 754 double precision floating point numbers.
