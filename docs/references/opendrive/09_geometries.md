> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 9 Geometries

## 9.1 Introduction to geometries

Road courses can have many different shapes. There are long, straight roads on open ground, elongated curves on motorways, or narrow turns in the mountains. In order to model all these road courses in a mathematically correct way, ASAM OpenDRIVE provides a variety of geometry elements:

- Straight lines
- Spirals or clothoids with a linearly changing curvature
- Arcs with a constant curvature
- Parametric cubic polynomials
- Cubic polynomials (deprecated)

![img](../_images/09_geometry/geom_overview.png)

Figure 22. Geometry elements in ASAM OpenDRIVE

[Figure 22](#fig-c2164748-80cf-4567-8d85-0c0b39f57429) shows the five possible ways to define the geometry of a road reference line.

The combination of all geometry elements available in ASAM OpenDRIVE allows for the creation of a great variety of road courses.

**XML example**

![img](../_images/09_geometry/adding_primitives.png)

Figure 23. Example for creating a road reference line from geometry elements

[Figure 23](#fig-1cc37e26-9f90-48c9-9081-fcddc9395512) shows the example of a road reference line consisting of one line, two arcs, and two spiral elements.

> **Note** To avoid leaps in the curvature, spirals should be used to connect line elements with arc elements.

- [Ex_Line-Spiral-Arc.xodr](../_attachments/examples/Ex_Line-Spiral-Arc/Ex_Line-Spiral-Arc.xodr)

## 9.2 Road reference line

The basic element of every road in ASAM OpenDRIVE is the road reference line. All geometry elements that describe the road shape and further properties of the road are defined along the road reference line. These properties include lanes and signals.

By definition, the road reference line runs in s-direction, while the lateral deviation of objects from the road reference line runs in t-direction. The direction of the road reference line does not indicate the driving direction.

![img](../_images/09_geometry/road_elements.png)

Figure 24. Individual parts of a road

[Figure 24](#fig-848bb044-6489-46f2-b236-009368db449a) shows the different parts of a road in ASAM OpenDRIVE.

- The road reference line
- Individual lanes of a road
- Features like signals that are placed along the road

**Elements in UML model**

![img](../_images/uml_class_diagrams/EAID_8A007E88_354E_463e_9D40_944248350DFB.png)

Figure 25. UML class diagram of the RoadGeometry class, including the road reference line elements

[Figure 25](#fig-e050d43d-eba2-49d7-a75e-29ba31d301e8) shows the UML class diagram of the ASAM OpenDRIVE RoadGeometry class.

**`<planView>` element**

In ASAM OpenDRIVE, the plan view is represented by the `<planView>` element within the `<road>` element. The `<planView>` element is a mandatory element in every `<road>` element.

UML class: t_road_planView
XML tag:   <planView> (Multiplicity: 1)

Contains geometry elements that define the layout of the road reference line in the x/y-plane (plan view).

**`<geometry>` element**

In ASAM OpenDRIVE, the geometry of a road reference line is represented by the `<geometry>` element within the `<planView>` element.

UML class: t_road_planView_geometry
XML tag:   <geometry> (Multiplicity: 1..*)

Table 18. Attributes of the <geometry> element
| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `hdg` | double | required | rad | Start orientation (inertial heading) |
| `length` | [t_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | required | m | Length of the element’s reference line |
| `s` | [t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | s-coordinate of start position |
| `x` | double | required | m | Start position (x inertial) |
| `y` | double | required | m | Start position (y inertial) |

**Rules**

The following rules apply to road reference lines:

- [asam.net:xodr:1.4.0:road.geometry.refline_exists](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-geometry-refline-exists): Each road shall have a road reference line.

- [asam.net:xodr:1.4.0:road.geometry.only_one_refline](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-geometry-only-one-refline): There shall be only one road reference line per road.

- The road reference line usually runs in the center of the road but may be laterally offset.

- [asam.net:xodr:1.4.0:road.geometry.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-geometry-elem-asc-order): `<geometry>` elements shall be defined in ascending order along the road reference line according to the s-coordinate.

- [asam.net:xodr:1.4.0:road.geometry.one_geom_elem_per_spec](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-geometry-one-geom-elem-per-spec): One `<geometry>` element shall contain only one element that further specifies the geometry of the road.

- [asam.net:xodr:1.7.0:road.geometry.contact_point](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-geometry-contact-point): If two roads are connected without a junction, the road reference line of a new road shall always begin at the `<contactPoint>` element of its successor or predecessor road. The road reference lines may be directed in opposite directions.

- [asam.net:xodr:1.4.0:road.geometry.refline_no_gaps](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-geometry-refline-no-gaps): A road reference line shall have no gaps.

- [asam.net:xodr:1.4.0:road.geometry.refline_no_kinks](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-geometry-refline-no-kinks): A road reference line should have no kinks.

- The s-value of each `<geometry>` shall be the sum of all `<geometry>` lengths prior

**Related topics**

- [Section 9.3, "Straight line"](09_03_straight_line.html#top-74c133a9-fc15-4a00-ae49-9a4cdc20b742)
- [Section 9.4, "Spiral"](09_04_spiral.html#top-9807cfa9-04f5-4eca-b468-d68b71486666)
- [Section 9.5, "Arc"](09_05_arc.html#top-0d75cff2-4103-401f-a802-b5868d15a4fe)
- [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)
- [Section 11.1, "Introduction to lanes"](../11_lanes/11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)

## 9.3 Straight line

A straight line is the simplest geometry element.

![img](../_images/09_geometry/straight_line.png)

Figure 26. A straight line

[Figure 26](#fig-ad5e465b-d76c-4518-8a13-44e12ba0df64) shows the concept of a straight line. A `<geometry>` element that forms a straight line contains the @s, @x, @y, @length, and @hdg attributes and one empty `<line>` element.

**Elements in UML model**

**`<line>` element**

In ASAM OpenDRIVE, a straight line is represented by the `<line>` element within the `<geometry>` element.

UML class: t_road_planView_geometry_line
XML tag:   <line>

A straight line is the simplest geometry element. It contains no further attributes.

**XML example**

```xml
<planView>
    <geometry s="0.0000000000000000e+00"
              x="-4.7170752711170401e+01"
              y="7.2847983820912710e-01"
              hdg="6.5477882613167993e-01"
              length="5.7280000000000000e+01">
        <line/>
    </geometry>
</planView>
```

**Related topics**

- [Section 9.2, "Road reference line"](09_02_road_reference_line.html#top-9cb15835-ff9e-4b51-9bc8-730a3695fde9)
- [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)

## 9.4 Spiral

A spiral is a clothoid that describes a changing curvature of the road reference line.

![img](../_images/09_geometry/spiral.png)

Figure 27. Road geometry described by a spiral

[Figure 27](#fig-6f6de31c-b273-410a-a245-5c3f40fd48ab) shows the concept of a spiral. Spirals may be used to describe the transition from a `<line>` element to an `<arc>` element without causing leaps in the curvature.

A spiral is characterized by the curvature at its start position (@curvStart) and the curvature at its end position (@curvEnd). Along the arc length of the spiral (see @length of the `<geometry>` element), the curvature is linear from the start to the end.

It is also possible to arrange several `<line>`, `<spiral>`, and `<arc>` elements in a sequence in order to describe complex curvatures.

**Elements in UML model**

**`<spiral>` element**

In ASAM OpenDRIVE, a spiral is represented by the `<spiral>` element within the `<geometry>` element.

UML class: t_road_planView_geometry_spiral
XML tag:   <spiral>

Spirals or more specifically Euler spirals also known as clothoids. They describe road reference lines with constantly changing curvatures.

Table 19. Attributes of the <spiral> element
| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `curvEnd` | double | required | 1/m | Curvature at the end of the element.<br>Positive curvature: left curve (counter-clockwise motion) Negative curvature: right curve (clockwise motion) |
| `curvStart` | double | required | 1/m | Curvature at the start of the element.<br>Positive curvature: left curve (counter-clockwise motion) Negative curvature: right curve (clockwise motion) |

**XML example**

```xml
<geometry s="100.0" x="38.00" y="-1.81" hdg="0.33" length="30.00">
    <spiral curvStart="0.0" curvEnd="0.013"/>
</geometry>
```

**Rules**

The following rules apply to spirals:

- @curvStart and @curvEnd should not be the same.

**Related topics**

- [Section 9.1, "Introduction to geometries"](09_01_introduction.html#top-0631e31d-eb24-470d-b767-a22e21dac50d)
- [Section 9.2, "Road reference line"](09_02_road_reference_line.html#top-9cb15835-ff9e-4b51-9bc8-730a3695fde9)
- [Section 9.5, "Arc"](09_05_arc.html#top-0d75cff2-4103-401f-a802-b5868d15a4fe)
- [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)

## 9.5 Arc

An arc describes a road reference line with constant curvature.

![img](../_images/09_geometry/arc.png)

Figure 28. Road geometry described by an arc

[Figure 28](#fig-293a9fe2-66bc-4741-a6bc-687f9c60f781) shows the concept of an arc.

**Elements in UML model**

**`<arc>` element**

In ASAM OpenDRIVE, an arc is represented by the `<arc>` element within the `<geometry>` element.

UML class: t_road_planView_geometry_arc
XML tag:   <arc>

Arcs describe road reference lines with constant curvature.

Table 20. Attributes of the <arc> element
| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `curvature` | double | required | 1/m | Constant curvature throughout the element.<br>Positive curvature: left curve (counter-clockwise motion) Negative curvature: right curve (clockwise motion) |

**XML example**

```xml
<planView>
    <geometry s="3.6612031746270386e+00"
              x="-4.6416930098385274e+00"
              y="4.3409250448366459e+00"
              hdg="5.2962250374496271e+00"
              length="9.1954178989066371e+00">
        <arc curvature="-1.2698412698412698e-01"/>
    </geometry>
</planView>
```

**Rules**

The following rules apply to arcs:

- @curvature should not be zero.

**Related topics**

- [Section 9.2, "Road reference line"](09_02_road_reference_line.html#top-9cb15835-ff9e-4b51-9bc8-730a3695fde9)
- [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)

## 9.6 Parametric cubic curve

Parametric cubic curves are used for complex curves that are to be generated from measurement data. Parametric cubic curves are more flexible and allow a greater variety of road courses than cubic polynoms. In comparison to cubic polynoms that are defined in a x/y coordinate system or as local u/v coordinates, the coordinates x and y are interpolated separately by their own splines with respect to a common interpolation parameter p.

**Elements in UML model**

**`<paramPoly3>` element**

In ASAM OpenDRIVE, parametric cubic curves are represented by `<paramPoly3>` elements within the `<geometry>` element.

UML class: t_road_planView_geometry_paramPoly3
XML tag:   <paramPoly3>

A parametric cubic curve describing the road reference line.

Table 21. Attributes of the <paramPoly3> element
| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `aU` | double | required | m | Polynom parameter a for u |
| `aV` | double | required | m | Polynom parameter a for v |
| `bU` | double | required | 1 | Polynom parameter b for u |
| `bV` | double | required | 1 | Polynom parameter b for v |
| `cU` | double | required | 1/m | Polynom parameter c for u |
| `cV` | double | required | 1/m | Polynom parameter c for v |
| `dU` | double | required | 1/m² | Polynom parameter d for u |
| `dV` | double | required | 1/m² | Polynom parameter d for v |
| `pRange` | [e_paramPoly3_pRange](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_22440E30_85F7_48d1_95DF_89D4972EA8BF) | required |  | Range of parameter p. Case arcLength: p in [0, @length of `<geometry>`] Case normalized: p in [0, 1] (Values of polynom paremeters have no unit) |

**XML example**

```xml
<planView>
    <geometry s="0.000000000000e+00"
              x="6.804539427645e+05"
              y="5.422483642942e+06"
              hdg="5.287405485081e+00"
              length="6.565893957370e+01">
        <paramPoly3 aU="0.000000000000e+00"
                    bU="1.000000000000e+00"
                    cU="-4.666602734948e-09"
                    dU="-2.629787927644e-08"
                    aV="0.000000000000e+00"
                    bV="1.665334536938e-16"
                    cV="-1.987729787588e-04"
                    dV="-1.317158625579e-09"
                    pRange="arcLength">
        </paramPoly3>
    </geometry>
</planView>
```

**Rules**

The following rules apply to parametric cubic curves:

- [asam.net:xodr:1.7.0:road.geometry.paramPoly3.valid_parameters](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-geometry-parampoly3-valid-parameters): The local u/v coordinate system should be aligned with the s/t coordinate system of the start point (meaning that the curve starts in the direction given by @hdg, and at the position given by @x and @y). To achieve this, the polynomial parameter coefficients have to be @aU=@aV=@bV=0, @bU>0.

- [asam.net:xodr:1.7.0:road.geometry.paramPoly3.arcLength_range](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-geometry-parampoly3-arclength-range): If @pRange="arcLength", p shall be chosen in [0, @length from `<geometry>`].

- [asam.net:xodr:1.7.0:road.geometry.paramPoly3.normalized_range](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-geometry-parampoly3-normalized-range): If @pRange="normalized", p shall be chosen in [0, 1].

- [asam.net:xodr:1.7.0:road.geometry.paramPoly3.length_match](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-geometry-parampoly3-length-match): The actual curve length, as determined by numerical integration over the parameter range, should match @length.

**Related topics**

- [Section 8.5, "Georeferencing"](../08_coordinate_systems/08_05_geo_referencing.html#top-3535a746-e0af-4020-b71c-3a94e7a855a1)
- [Section 9.1, "Introduction to geometries"](09_01_introduction.html#top-0631e31d-eb24-470d-b767-a22e21dac50d)
- [Section 9.7, "Cubic polynom (deprecated)"](09_07_poly3.html#top-2f3fb62e-d0be-4eb8-a0f6-8bc0d6f6d953)
- [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)

### 9.6.1 Generating roads using parametric cubic curves

Generating road courses with parametric cubic curves only require x- and y-coordinates. For reasons of consistency to cubic polynoms, they may be calculated simultaneously to cubic polynoms using local u- and v-coordinates.

`u(p) = aU + bU*p + cU*p2 + dU*p³`<br>`v(p) = aV + bV*p + cV*p2 + dV*p³`

Unless otherwise stated, the interpolation parameter p is in the range [0;1]. Alternatively, it may be given in the range [0; @length of `<geometry>`]. Similar to cubic polynoms, the local coordinate system with the variables u and v may be placed and oriented arbitrarily.

To simplify representation, the local coordinate system should be aligned with the s/t coordinate system at the start point (@x,@y) and start orientation @hdg:

- The u-axis points in local s-direction, meaning along the road reference line at the start point.
- The v-axis points in local t-direction, meaning in lateral deviation from the road reference line at the start point.
- The parameters @aU, @aV and @bV shall be zero, @bU shall be > 0.

Providing non-zero values for the parameters @aU, @aV and @bV leads to a shift and rotation of the s/t coordinates as shown [Figure 29](#fig-9a7c32eb-ea76-4f17-9d1e-8445ee53d91b), [Figure 30](#fig-4c29c6d1-e115-441e-8580-0e73a32059a1) and [Figure 31](#fig-6ddce25c-ac8f-408d-9ee9-5a22a24e0cd7).

After defining the points of the curve for a given parameter p, the u-values and v-values are transformed into values of the x/y coordinate system with regard to the shifts and orientation specified by the parameters @aU, @aV, @bU, @bV, the start coordinates (@x,@y) and the start orientation @hdg.

> **Note** There is a non-linear relation between the interpolation parameter p and the actual length of the arc between the start point (@x,@y) in the `<geometry>` element and the point (x(p),y(p)) associated with the parameter `p`. In general, only the startpoint and endpoint parameter p=0 and p=@length (for the option @pRange=arcLength) coincides with the actual length of the arc.

Taking into account shift and rotation parameters @a and @b and the (@x,@y) and @hdg specified in the `<geometry>` element, the final x/y curve position is located at a given u-coordinate, as shown in [Figure 35](09_07_poly3.html#fig-4f08e8e2-e5e5-44df-9a2f-8dfde65f3881).

![img](../_images/09_geometry/param_poly_1.png)

Figure 29. A parametric cubic curve for interpolation of the u-coordinate

![img](../_images/09_geometry/param_poly_2.png)

Figure 30. A parametric cubic curve for interpolation of the v-coordinate

![img](../_images/09_geometry/param_poly_3.png)

Figure 31. A parametric cubic curve

## 9.7 Cubic polynom (deprecated)

Cubic polynomials may be used to generate complex road courses that are derived from measurement data. For a given sequence of measured coordinates along the road reference line in the x/y coordinate system, measurement pairs define the polynomial limits of the segment.

The road reference line of the road is described by a local cubic polynomial. Specifying continuity conditions, for example segment continuity, tangent and/or curvature continuity, at the limits of the segment allows to merge several cubic polynomial segments and to form a global cubic spline interpolation curve for the entire course of the road. As an additional advantage, routing along polynomials can be realized more efficiently than along clothoids.

**Elements in UML model**

**`<poly3>` element**

In ASAM OpenDRIVE, a cubic polynomial is represented by the `<poly3>` element within the `<geometry>` element.

UML class: t_road_planView_geometry_poly3
XML tag:   <poly3>

A cubic polynom describing the road reference line.

Table 22. Attributes of the <poly3> element
| Name | Type | Use | Unit | Deprecated | Description |
| --- | --- | --- | --- | --- | --- |
| `a` | double | required | m | 1.8.0 | Polynom parameter a |
| `b` | double | required | 1/m | 1.8.0 | Polynom parameter b |
| `c` | double | required | 1/m² | 1.8.0 | Polynom parameter c |
| `d` | double | required | 1/m³ | 1.8.0 | Polynom parameter d |

**XML example**

```xml
<geometry s="0.0000000000000000e+00"
          x="-6.8858131487889267e+01"
          y="4.1522491349480972e-01"
          hdg="6.5004409066736524e-01"
          length="2.5615689718113455e+01">
    <poly3 a="0.0000000000000000e+00"
           b="0.0000000000000000e+00"
           c="1.4658732624442020e-02"
           d="-5.7746497381565959e-04"/>
</geometry>
<geometry s="2.5615689718113455e+01"
          x="-4.8650519031141869e+01"
          y="1.5778546712802767e+01"
          hdg="2.9381264033570398e-01"
          length="3.1394863696852912e+01">
    <poly3 a="0.0000000000000000e+00"
           b="0.0000000000000000e+00"
           c="-1.9578575382799307e-02"
           d="2.3347864348004167e-04"/>
</geometry>
```

**Rules**

The following rules apply to cubic polynomials:

- A cubic polynomial may be used to describe the course of a road for which measurement data is available.
- If the local u/v coordinate system is aligned with the s/t coordinate system of the start point, the polynomial parameter coefficients are a=b=0.
- The starting point (@x,@y) of the `<geometry>` element is located on the v-coordinate axis of the local u/v coordinate system.
- The polynomial parameters a and b should be 0 for a smooth road reference line.

**Related topics**

- [Section 8.5, "Georeferencing"](../08_coordinate_systems/08_05_geo_referencing.html#top-3535a746-e0af-4020-b71c-3a94e7a855a1)
- [Section 9.1, "Introduction to geometries"](09_01_introduction.html#top-0631e31d-eb24-470d-b767-a22e21dac50d)
- [Section 9.6, "Parametric cubic curve"](09_06_param_poly3.html#top-f99539a9-f2db-47cf-b728-4277cb50e3f2)
- [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)

### 9.7.1 Background information on cubic polynomials (deprecated)

The interpolation of a cubic polynomial in the x/y coordinate system is described with the following formula:

`y(x) = a + b*x + c*x2 + d*x³`

The polynomial parameters a, b, c, d in the calculation are used to define the course of the roads. With the help of the parameters a-d, the y-coordinate can be calculated from the x-coordinate at every point in the coordinate system.

![img](../_images/09_geometry/poly3.png)

Figure 32. A cubic polynomial

[Figure 32](#fig-94518f50-440c-4b62-a332-51bada4188cf) shows the concept of a cubic polynomial in the x/y coordinate system with the following values:

a = 20<br>b = 0<br>c = 0.0005<br>d = 0.0001

### 9.7.2 Creating roads using cubic polynomials (deprecated)

A cubic polynomial described in the x/y coordinate system is not suitable to describe curved segments with an arbitrary orientation, as shown in [Figure 33](#fig-cd43f7f2-e7dd-4f10-878a-f83a5f0243a7). To handle curved segments with two or more y-coordinates at a given x-coordinate, cubic polynomial segments may be defined with respect to a local u/v coordinate system. Using the local u/v coordinate system increases flexibility in the curve definition. The following formula is used:

`v(u) = a + b*u + c*u2 + d*u³`

The orientation of the local u/v coordinate system should be chosen in such a way that the curve is expressed as a function v(u) at increasing u-coordinates.

![img](../_images/09_geometry/curve_1.png)

Figure 33. A curve which cannot be represented by a cubic polynomial w.r.t x parameter

Usually, the u/v coordinate system is aligned with the s/t coordinate system at the segment’s start position (@x,@y) and start orientation @hdg, specified in the `<geometry>` element. This choice results in polynomial parameters a=b=0 (see [Figure 34](#fig-78cca9c1-1af4-4a2f-80c1-d5c108b653fd)). As an additional option, the local u/v coordinate system may be rotated relative to the start point (@x,@y) by specifying a polynomial parameter @b that is unequal to zero. Here, the arctan (@b) defines the start heading of the polynomial curve with respect to the local u/v coordinate system. An additional shift of the u/v coordinate origin along the v-coordinate axis, while (@x,@y) shall be located at u=0, may be achieved by setting the polynomial parameter @a unequal to zero (see [Figure 35](#fig-4f08e8e2-e5e5-44df-9a2f-8dfde65f3881)). The parameter u may be varied within 0 and the projection of the end point of the curve onto the u-coordinate axis. For the given parameter u, the local coordinate v(u) defines the point on the curve in the local u/v coordinate system.

`v(u) = a + b*u + c*u2 + d*u³`

Taking into account shift and rotation parameters @a and @b and the (@x,@y) and @hdg specified in the `<geometry>` element, the final x/y curve position is located at a given u-coordinate, as shown in [Figure 35](#fig-4f08e8e2-e5e5-44df-9a2f-8dfde65f3881).

![img](../_images/09_geometry/curve_2.png)

Figure 34. Transformation from a u/v to a x/y coordinate system with a=b=0

![img](../_images/09_geometry/curve_3.png)

Figure 35. Transformation from a u/v to a x/y coordinate system with a!=0 and b!=0
