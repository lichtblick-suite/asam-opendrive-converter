> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 13 Objects

## 13.1 Introduction to objects

Objects are items that influence a road by expanding, delimiting, or supplementing its course.
The most common examples are parking spaces, crosswalks, and traffic barriers.

<a id="fig-1c502436-9b71-49e2-b146-6658c7d081be"></a>
![img](../_images/13_objects/object_1.png)

Figure 108. Circular and angular object

[Figure 108](#fig-1c502436-9b71-49e2-b146-6658c7d081be) shows the bounding box of an angular object using width, length, and height and the bounding box of an circular object using radius and height.

Complex objects may be further described using `<outline>` elements.
If an `<outline>` element is defined, it supersedes the bounding box.

Objects in ASAM OpenDRIVE do not change their position.

They may be declared dynamic or static:

* Dynamic objects are static but have one or more movable parts.
  Examples are fans in tunnels or windmills.
* Stationary objects are completely static without any movable parts.
  Examples are buildings or trees.

Objects are defined per `<road>` element.

<a id="fig-7ed192f9-7d81-4d9e-8b30-246cd9f36fd8"></a>
![img](../_images/13_objects/object_18.png)

Figure 109. Placing objects on roads

[Figure 109](#fig-7ed192f9-7d81-4d9e-8b30-246cd9f36fd8) shows an object that is not properly placed on a road.
Objects that are placed on roads using the `<elevationProfile>` element or the `<lateralProfile>` element should be so small that these objects do not cut or float above the road surface significantly, nor cause skewed ASAM OpenCRG surfaces.

**Elements in UML model**

**`<objects>` element**

In ASAM OpenDRIVE, objects are represented by the `<objects>` element within the `<road>` element.

```
UML class: t_road_objects
XML tag:   <objects> (Multiplicity: 0..1)
```

Container for all objects along a road.

<a id="fig-52ccdd39-1a3c-486c-a6d2-e6fff6202842"></a>
![img](../_images/uml_class_diagrams/EAID_981EF40C_984C_4522_BBD4_7466215BCDE0.png)

Figure 110. UML class diagram of the Objects class

[Figure 110](#fig-52ccdd39-1a3c-486c-a6d2-e6fff6202842) shows the UML class diagram of the ASAM OpenDRIVE Objects class.

**`<object>` element**

In ASAM OpenDRIVE, a single object is represented by the `<object>` element within the `<objects>` element.

```
UML class: t_road_objects_object
XML tag:   <object> (Multiplicity: 0..*)
```

Objects influence a road by expanding, delimiting, or supplementing its course.
Objects are elements that form the environment, for example, buildings, guard rails, poles, and trees.
Objects do not influence the behavior of traffic directly, unlike signals.

There are two ways to describe the bounding box of objects.

* For an angular object: definition of the width, length and height.
* For a circular object: definition of the radius and height.

<a id="tab-EAID_14D90D1D_C726_48c6_8672_BC7E1F409E94"></a>
Table 86. Attributes of the <object> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `dynamic` | [t\_yesNo](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_A171A2AA_DFE6_4b8b_BA5A_AD59E6334468) | optional |  |  | Indicates whether the object is dynamic or static, default value is “no” (static). Dynamic object cannot change its position. |
| `hdg` | double | optional | rad |  | Heading angle of the object relative to road direction |
| `height` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Height of the object’s bounding box. @height is defined in the local coordinate system u/v along the z-axis |
| `id` | string | required |  |  | Unique ID within database |
| `length` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | optional | m |  | Length of the object’s bounding box, alternative to @radius. @length is defined in the local coordinate system u/v along the u-axis |
| `name` | string | optional |  |  | Name of the object. May be chosen freely. |
| `orientation` | [e\_orientation](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D8972119_8CE4_407e_A4AD_3183B0B5C687) | optional |  |  | "+" = valid in positive s-direction "-" = valid in negative s-direction "none" = valid in both directions (does not affect the heading) |
| `perpToRoad` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | optional |  | 1.7.0 | Alternative to @pitch and @roll. If true, the object is vertically perpendicular to the road surface at all points and @pitch and @roll are ignored. Default is false. |
| `pitch` | double | optional | rad |  | Pitch angle relative to the x/y-plane |
| `radius` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | optional | m |  | radius of the circular object’s bounding box, alternative to @length and @width. @radius is defined in the local coordinate system u/v |
| `roll` | double | optional | rad |  | Roll angle relative to the x/y-plane |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m |  | s-coordinate of object’s origin |
| `subtype` | string | optional |  |  | Variant of a type |
| `t` | double | required | m |  | t-coordinate of object’s origin |
| `type` | [e\_objectType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_C47587D0_7173_42df_8BB7_36B2C598D95F) | optional |  |  | Type of object. For a parking space, the `<parkingSpace>` element may be used additionally. |
| `validLength` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Validity of object along s-axis (0.0 for point object) |
| `width` | double | optional | m |  | Width of the object’s bounding box, alternative to @radius. @width is defined in the local coordinate system u/v along the v-axis |
| `zOffset` | double | required | m |  | z-offset of object’s origin relative to the elevation of the road reference line |

For the different object types refer to [Combinations of elements and attributes for object types](13_14_object_examples.html#top-bd330b94-a6e3-42d9-a2b3-0bae5cb19e92).

**XML example**

```
<objects>
    <object type="building"
            name="ExampleBuilding"
            id="1"
            s="80.0"
            t="17.0"
            zOffset="0.0"
            orientation="none"
            length="12.15"
            width="22.415"
            height="11.84"
            hdg="1.44"
            pitch="0.0"
            roll="0.00">
    </object>
</objects>
```

**Rules**

The following rules apply to objects:

* [asam.net:xodr:1.7.0:road.object.type\_attr](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-type-attr): The type of an object shall be given by the @type attribute.

* An object may either be dynamic or static, but an object cannot change its position.
* Objects derived from ASAM OpenSCENARIO shall not be mixed with objects described in ASAM OpenDRIVE.

* [asam.net:xodr:1.7.0:road.object.orientation](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-orientation): The direction for which objects are valid shall be specified.

* [asam.net:xodr:1.7.0:road.object.s\_t\_coords](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-s-t-coords): The origin position of the object shall be described with s- and t-coordinates along the road surface.

* [asam.net:xodr:1.7.0:road.object.circular\_vs\_angular](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-circular-vs-angular): Objects may be of circular or angular shape. The possibilities are mutually exclusive. The shape is defined by the used attributes.

**Related topics**

* [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)
* [Section 13.2, "Repeating objects"](13_02_repeating_objects.html#top-fc693ed2-a38b-4cfc-a346-90c8a478bfd0)
* [Section 13.3, "Object outline"](13_03_object_outline.html#top-67295042-9707-4ad5-9671-b80cde49bb3a)

## 13.2 Repeating objects

To avoid lengthy XML code, objects of the same type may be repeated.
The attributes of the repeated object may be changed.
This element is mainly used to describe railings, railing posts, and street lamps.

<a id="fig-9e8f61d7-f480-48c1-b65a-415e36f24d32"></a>
![img](../_images/13_objects/object_2.png)

Figure 111. Repeated large angular object

[Figure 111](#fig-9e8f61d7-f480-48c1-b65a-415e36f24d32) shows top and side views of a large angular object that repeats one other object.

<a id="fig-270402d4-f2f1-41e8-835b-e4bde027137d"></a>
![img](../_images/13_objects/object_3.png)

Figure 112. Repeated small angular objects

[Figure 112](#fig-270402d4-f2f1-41e8-835b-e4bde027137d) shows top and side views of several smaller angular objects that are repeated.

<a id="fig-7c98e28c-5c09-4993-ad91-62c41d509c64"></a>
![img](../_images/13_objects/object_4.png)

Figure 113. Repeated small circular objects

[Figure 113](#fig-7c98e28c-5c09-4993-ad91-62c41d509c64) shows top and side views of several smaller circular objects that are repeated.

**Elements in UML model**

**`<repeat>` element**

In ASAM OpenDRIVE, repeating objects are represented by the `<repeat>` element within the `<object>` element.

```
UML class: t_road_objects_object_repeat
XML tag:   <repeat> (Multiplicity: 0..*)
```

To avoid lengthy XML code, objects of the same type may be repeated.
Attributes of the repeated object shall overrule the attributes from the original object.
If attributes are omitted in the repeated objects, the attributes from the original object apply.

<a id="tab-EAID_5B518309_B289_4fb0_8047_FF0A76A16EAF"></a>
Table 87. Attributes of the <repeat> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `detachFromReferenceLine` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | optional |  | 1.8.0 | If true, the start and end positions are connected as a straight line which does not follow the road reference line. The default is false |
| `distance` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m |  | Distance between two instances of the object; If this value is zero, then the object is treated like a continuous feature, for example, a guard rail, a wall, etc. |
| `heightEnd` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m |  | Height of the object at @s + @length |
| `heightStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m |  | Height of the object at @s |
| `lengthEnd` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Length of the object at @s + @length |
| `lengthStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Length of the object at @s |
| `length` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required |  |  | Length of the repeat area, along the road reference line in s-direction. |
| `radiusEnd` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Radius of the object at @s + @length |
| `radiusStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Radius of the object at @s |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m |  | s-coordinate of start position, overrides the corresponding argument in the original `<object>` record |
| `tEnd` | double | required | m |  | Lateral offset of object’s reference point at @s + @length |
| `tStart` | double | required | m |  | Lateral offset of objects reference point at @s |
| `widthEnd` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Width of the object at @s + @length |
| `widthStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m |  | Width of the object at @s |
| `zOffsetEnd` | double | required | m |  | z-offset of the object at @s + @length, relative to the elevation of the road reference line |
| `zOffsetStart` | double | required | m |  | z-offset of the object at @s, relative to the elevation of the road reference line |

**XML example**

```
<objects>
    <object type="streetLamp"
            name="ExampleStreetLamp"
            id="2"
            s="15.00"
            t="5.0"
            zOffset="0.0"
            orientation="none"
            length="0.14"
            width="1.28"
            height="7.35"
            hdg="0.0"
            pitch="0.00"
            roll="0.0000">
        <repeat s="15.0"
                length="180.0"
                distance="60.00"
                tStart="5.0"
                tEnd="5.0"
                widthStart="1.28"
                widthEnd="1.28"
                heightStart="7.35"
                heightEnd="7.35"
                zOffsetStart="0.0"
                zOffsetEnd="0.0"/>
    </object>
</objects>
```

**Rules**

The following rules apply to repeating objects:

* Parameters of the repeated object may differ from the original object.
* Parameters of the repeated object shall overrule the parameters from the original object.
* Repeated objects shall have valid s-coordinates and lengths.

**Related topics**

* [Section 12.13, "Junction groups"](../12_junctions/12_13_junction_groups.html#top-99e6f0a6-ad6b-4c5e-bace-622208adfc2f)
* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)

## 13.3 Object outline

Objects may have an outline that is too complex to be described by parameters for angular and circular objects alone.
Therefore, the outline of polygonal objects or non-rectangular objects may be described in a more detailed way.

An outline defines a series of corner points, including the height of the object relative to the road reference line.
The inner area of the described outline may be filled with a filling type, for example, grass, concrete, asphalt, or pavement.
The definition of the outline of objects is mainly used for traffic islands, irregularly shaped parking spaces, and special road markings.

Defining multiple outlines for one object is useful in several cases.
For example, a tree has a narrow trunk and a wide crown.
A driving simulation application might conclude that a vehicle cannot pass the tree if it only just recognized a bounding box representing the tree.
Two outlines could be defined, one for the narrow trunk and one for the wide crown of the tree.
A driving simulation application in this case could conclude that the vehicle can drive underneath the tree.
Another example is a street light that consist of a pole and a light.
Traffic islands often require more than one outline because the outlines represent logical information, for example, an area where pedestrians can stay.
See example `UC_2Lane-RoundAbout-3Arms.xodr` in [Section 13.3.2, “`<cornerLocal>` element”](#sec-cc00c8a6-eea6-49e6-b90c-37b21524c748).

<a id="fig-50439882-7c73-4e96-94ac-2b50a31311a0"></a>
![img](../_images/13_objects/object_5.png)

Figure 114. Traffic island as object

[Figure 114](#fig-50439882-7c73-4e96-94ac-2b50a31311a0) shows a traffic island which is placed in the middle of a road as non-rectangular object.

In ASAM OpenDRIVE, the outline of objects is represented by the `<outlines>` element within the `<object>` element.

The `<outlines>` element serves as a wrapper for the `<outline>` element, which itself contains further elements to describe, for example, corner roads, bridges, and borders.

**Elements in UML model**

**`<outlines>` element**

In ASAM OpenDRIVE, the outlines of objects are represented by the `<outlines>` element within the `<object>` element.

```
UML class: t_road_objects_object_outlines
XML tag:   <outlines> (Multiplicity: 0..1)
```

Wrapper for the different outline entries of an object, that can contain multiple outline definitions.
If `<outlines>` is not used, an object can have only a single `<outline>` entry.

**`<outline>` element**

In ASAM OpenDRIVE, a single outline is represented by the `<outline>` element within the `<outlines>` element.

```
UML class: t_road_objects_object_outlines_outline
XML tag:   <outline> (Multiplicity: 1..*)
```

Defines a series of corner points, including the height of the object relative to the road reference line.
For areas, the points should be listed in counter-clockwise order.
The inner area of the described outline may be filled with a filling type, such as grass, concrete, asphalt, or pavement.

An element shall be followed by two or more `<cornerRoad>` elements or by two or more `<cornerLocal>` elements.

ASAM OpenDRIVE 1.4 outline definitions (without `<outlines>` parent element) shall still be supported.

<a id="tab-EAID_FBFD79AB_B903_4d52_B904_091A887ED9B2"></a>
Table 88. Attributes of the <outline> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `closed` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | optional | If true, the outline describes an area, not a linear feature |
| `fillType` | [e\_outlineFillType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_7449C6EF_EFB3_4eb9_9715_762FE63ED2C4) | optional | Type used to fill the area inside the outline |
| `id` | nonNegativeInteger | optional | ID of the outline. Must be unique within one object. |
| `laneType` | [e\_laneType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_9692E2F3_4895_4ce6_A84E_FB1297B0B58E) | optional | Describes the lane type of the outline |
| `outer` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | optional | Defines if outline is an outer outline of the object |

**XML example**

* [Ex\_TrafficIsland-CornerRoad.xodr](../_attachments/examples/Ex_TrafficIsland-CornerRoad/Ex_TrafficIsland-CornerRoad.xodr)

**Rules**

The following rules apply to outline elements:

* [asam.net:xodr:1.7.0:road.object.outline.outline\_followed\_by\_corner](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-outline-outline-followed-by-corner): An `<outline>` element shall be followed by two or more `<cornerRoad>` elements or by two or more `<cornerLocal>` elements.

* The `<outline>` element may represent an area or a line feature.
* The inner area of the described outline may be filled with a filling type.
* An outline may be specified as an objects outer or inner outline.
  It may be specified if the described outline is located at the outer border of the object.
* It may be specified as which lane type the object is treated by the application.

* [asam.net:xodr:1.7.0:road.object.outline.points\_inside\_box](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-outline-points-inside-box): All points of the `<outline>` element must be located inside the bounding box.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.3.1, “`<cornerRoad>` element”](#sec-4bfef803-e146-4f6d-86b3-533540f56b51)
* [Section 13.3.2, “`<cornerLocal>` element”](#sec-cc00c8a6-eea6-49e6-b90c-37b21524c748)

<a id="sec-4bfef803-e146-4f6d-86b3-533540f56b51"></a>
### 13.3.1. `<cornerRoad>` element

`<cornerRoad>` elements are mandatory elements inside an `<outline>` element.
They are used to describe non-linear forms of objects.
They are mutually exclusive with `<cornerLocal>` elements.
`<cornerRoad>` elements describe the outline of objects relative to the road reference line with their s- and t-coordinates.

The shape of an object may be described by the object’s height at a `<cornerRoad>` point and the difference in height relative to the road reference line.

<a id="fig-ed2f8ade-8aa9-4dec-9af7-0d9163d293a9"></a>
![img](../_images/13_objects/object_6.png)

Figure 115. Object described by corner road coordinates

[Figure 115](#fig-ed2f8ade-8aa9-4dec-9af7-0d9163d293a9) shows a non-linear object with several corner points that is described by the s- and t-coordinates along the road reference line.
The corner road helps to position objects along a road, for example concrete barriers.

**Elements in UML model**

**`<cornerRoad>` element**

In ASAM OpenDRIVE, corner points of an object that use s- and t-coordinates are represented by the `<cornerRoad>` element within the `<outline>` element.

```
UML class: t_road_objects_object_outlines_outline_cornerRoad
XML tag:   <cornerRoad> (Multiplicity: 2..*)
```

Defines a corner point on the object’s outline in road coordinates.

<a id="tab-EAID_9BA2244E_2D24_461b_871E_6ED8C6ED78E0"></a>
Table 89. Attributes of the <cornerRoad> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `dz` | double | required | m | dz of the corner relative to road reference line |
| `height` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Height of the object at this corner, along the z-axis |
| `id` | nonNegativeInteger | optional |  | ID of the outline point. Must be unique within one outline |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | s-coordinate of the corner |
| `t` | double | required | m | t-coordinate of the corner |

**XML example**

* [Ex\_TrafficIsland-CornerRoad.xodr](../_attachments/examples/Ex_TrafficIsland-CornerRoad/Ex_TrafficIsland-CornerRoad.xodr)

**Rules**

The following rules apply to `<cornerRoad>` elements:

* [asam.net:xodr:1.7.0:road.corner\_road.element\_min\_amount](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-corner-road-element-min-amount): There shall be at least two `<cornerRoad>` elements inside an `<outline>` element.

* [asam.net:xodr:1.7.0:road.corner\_road.corner\_road\_local\_exclusivity](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-corner-road-corner-road-local-exclusivity): There shall be no `<cornerLocal>` element next to a `<cornerRoad>` element inside the same `<outline>` element.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 10.5.1, "Superelevation"](../10_roads/10_05_elevation.html#sec-4abf7baf-fb2f-4263-8133-ad0f64f0feac)
* [Section 13.3.2, “`<cornerLocal>` element”](#sec-cc00c8a6-eea6-49e6-b90c-37b21524c748)

<a id="sec-cc00c8a6-eea6-49e6-b90c-37b21524c748"></a>
### 13.3.2. `<cornerLocal>` element

`<cornerLocal>` elements are mandatory elements inside an `<outline>` element.
They are used to describe non-linear forms of objects.
They are mutually exclusive with `<cornerRoad>` elements.
`<cornerLocal>` elements describe the outline of objects within their local u- and v-coordinates.

<a id="fig-9e094cdb-4cf5-4bee-a67b-d98530bb6ecc"></a>
![img](../_images/13_objects/object_7.png)

Figure 116. An object described by `<cornerLocal>` coordinates

[Figure 116](#fig-9e094cdb-4cf5-4bee-a67b-d98530bb6ecc) shows a non-linear object with several corner points that is described within a local coordinate system.
Corner local helps to position objects beyond a road, relative to a single point, for example buildings or traffic islands.

**Elements in UML model**

**`<cornerLocal>` element**

In ASAM OpenDRIVE, corner points of an object that use local u- and v-coordinates are represented by the `<cornerLocal>` element within the `<outline>` element.

```
UML class: t_road_objects_object_outlines_outline_cornerLocal
XML tag:   <cornerLocal> (Multiplicity: 2..*)
```

Used to describe complex forms of objects.
Defines a corner point on the object outline relative to the object pivot point in local u/v-coordinates.
The insertion point and the orientation of the object are given by the @s, @t, @zOffset and @hdg attributes of the element.

<a id="tab-EAID_F67B9F9C_1EC7_4e0f_B0CC_A90E0D6CFAA2"></a>
Table 90. Attributes of the <cornerLocal> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `height` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Height of the object at this corner, along the z-axis |
| `id` | nonNegativeInteger | optional |  | ID of the outline point. Shall be unique within one outline. |
| `u` | double | required | m | Local u-coordinate of the corner |
| `v` | double | required | m | Local v-coordinate of the corner |
| `z` | double | required | m | Local z-coordinate of the corner |

**XML example**

* [UC\_2Lane-RoundAbout-3Arms.xodr](../_attachments/use_cases/UC_2Lane-RoundAbout-3Arms/UC_2Lane-RoundAbout-3Arms.xodr)

**Rules**

The following rules apply to `<cornerLocal>` elements:

* [asam.net:xodr:1.7.0:road.corner\_local.element\_min\_amount](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-corner-local-element-min-amount): There shall be at least two `<cornerLocal>` elements inside an `<outline>` element.

* There shall be no mixture of `<cornerRoad>` and `<cornerLocal>` elements inside the same `<outline>` element.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.3.1, “`<cornerRoad>` element”](#sec-4bfef803-e146-4f6d-86b3-533540f56b51)

## 13.4 Object skeleton

Objects may use a skeleton polyline to describe its shape more closely within this objects bounding box.
This skeleton can define the appropriate parts of an object by a series of points with either a radius or a width and height.
It also adds the possibility to define an @intersectionPoint attribute in order to describe where that object touches the road or ground surface.

Only objects of certain values of the @type attribute shall be described with these skeleton polylines.

The `<skeleton>` element serves as a wrapper for the `<polyline>` element that contains further elements to describe the different points of that polyline.

**Elements in UML model**

**`<skeleton>` element**

In ASAM OpenDRIVE, the skeleton of objects is represented by the `<skeleton>` element within the `<object>` element.

```
UML class:  t_road_objects_object_skeleton
XML tag:    <skeleton> (Multiplicity: 0..1)
Introduced: 1.8.0
```

Wrapper for the object polylines, that can be used to describe the actual shape inside the bounding box more closely

**`<polyline>` element**

In ASAM OpenDRIVE, the polyline of a skeleton is represented by the `<polyline>` element within the `<skeleton>` element.

```
UML class:  t_road_objects_object_skeleton_polyline
XML tag:    <polyline> (Multiplicity: 1..*)
Introduced: 1.8.0
```

Defines a series of points relative to the road reference line.

An `<polyline>` element shall be followed by either two or more `<vertexRoad>` elements or by two or more `<vertexLocal>` elements.

<a id="tab-EAID_03719C68_34C8_43a5_92AF_334FAF50535E"></a>
Table 91. Attributes of the <polyline> element

| Name | Type | Use | Introduced | Description |
| --- | --- | --- | --- | --- |
| `id` | positiveInteger | optional | 1.8.0 | ID of the polyline. Must be unique within one object. |

**Rules**

The following rules apply to `<skeleton>` elements:

* [asam.net:xodr:1.8.0:road.object.skeleton.polyline\_followed\_by\_vertex](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-polyline-followed-by-vertex): A `<polyline>` element shall be followed by either two or more `<vertexRoad>` elements or by two or more `<vertexLocal>` elements.

* The `<polyline>` element may use the @intersectionPoint attribute for its point to specify where that object intersects with the ground.

* [asam.net:xodr:1.8.0:road.object.skeleton.points\_inside\_box](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-points-inside-box): All points of the `<polyline>` element must be located inside the bounding box, including their local width and height or radius.

* [asam.net:xodr:1.8.0:road.object.skeleton.points\_requirements](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-points-requirements): All points of the `<polyline>` element are connected with a straight line between the `<vertexRoad>` or `<vertexLocal>` elements and the specified @radius or @width and @height attributes of each point are perpendicular to this line.{rule\_description}

* Changes in @radius or @width and @height attributes between points of the `<polyline>` element are interpolated linearly.

* [asam.net:xodr:1.8.0:road.object.skeleton.use\_radius\_or\_width\_length](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-use-radius-or-width-length): Each `<polyline>` element shall either use @radius or @width and @length attributes for all of its vertex elements.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.4.1, “`<vertexRoad>` element”](#sec-898f3cd1-0313-4df7-921e-7f99415d2918)
* [Section 13.4.2, “`<vertexLocal>` element”](#sec-63c9f5b5-63d3-46ba-86fc-1a9a3f4317e8)

<a id="sec-898f3cd1-0313-4df7-921e-7f99415d2918"></a>
### 13.4.1. `<vertexRoad>` element

`<vertexRoad>` elements are mandatory elements inside a `<polyline>` element.
They are used to describe a more detailed form of objects inside their bounding box.
They are mutually exclusive with `<vertexLocal>` elements.
`<vertexRoad>` elements describe a skeleton polyline of objects relative to the road reference line with their s- and t-coordinates.

The shape of a polyline may be described by the object’s local width and length or radius at each `<vertexRoad>` point and the `<vertexRoad>` point’s difference in height @dz relative to the road reference line.

**Elements in UML model**

**`<vertexRoad>` element**

In ASAM OpenDRIVE, polyline points that use s- and t-coordinates are represented by the `<vertexRoad>` element within the `<polyline>` element.

```
UML class:  t_road_objects_object_skeleton_polyline_vertexRoad
XML tag:    <vertexRoad> (Multiplicity: 2..*)
Introduced: 1.8.0
```

Defines a point on the object’s polyline in road coordinates.
`<vertexRoad>` can use either radius or length/width within one `<polyline>` element.

<a id="tab-EAID_414A0AD7_F2C8_4348_8EC9_49480F86D47E"></a>
Table 92. Attributes of the <vertexRoad> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `dz` | double | required | m | 1.8.0 | dz of the polyline point relative to road reference line parallel to z. |
| `id` | positiveInteger | optional |  | 1.8.0 | ID of the vertex point. Must be unique within one polyline. |
| `intersectionPoint` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | optional |  | 1.8.0 | Vertex point is intersecting the ground. "false" is used as default. |
| `radius` | double | optional | m | 1.8.0 | Local radius of the object at this vertex point, along the polyline |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | 1.8.0 | s-coordinate of the corner |
| `t` | double | required | m | 1.8.0 | t-coordinate of the corner |

**XML example**

<a id="fig-b2b29a46-5e48-47d9-8eb7-029031c97bb9"></a>
![img](../_images/13_objects/object_skeleton_pole.png)

Figure 117. Example of the bounding box and skeleton of a traffic light pole

[Figure 117](#fig-b2b29a46-5e48-47d9-8eb7-029031c97bb9) shows a traffic light pole with an extension arm that spans over the street which can be described with two separate polylines, one for the main pole that defines an intersection point and one for the extension arm.

```
<object type="pole"
        subtype="trafficLight"
        name=""
        id="4000002"
        s="25.0"
        t="1.5"
        zOffset="0.00"
        roll="0"
        pitch="0"
        validLength="0"
        orientation="none"
        height="4"
        length="0.3"
        width="3"
        dynamic="no"
        hdg="0">
    <skeleton>
        <polyline id="1">
            <vertexRoad s="25.0" t="2.8" dz="0.0" radius="0.15" id="0" intersectionPoint="true"/>
            <vertexRoad s="25.0" t="2.8" dz="4.0" radius="0.10" id="1"/>
        </polyline>
        <polyline id="2">
            <vertexRoad s="25.0" t="2.8" dz="3.0" radius="0.15" id="0"/>
            <vertexRoad s="25.0" t="2.15" dz="3.25" radius="0.15" id="1"/>
            <vertexRoad s="25.0" t="0.0" dz="3.25" radius="0.15" id="2"/>
        </polyline>
    </skeleton>
</object>
```

**Rules**

The following rules apply to `<vertexRoad>` elements:

* [asam.net:xodr:1.8.0:road.object.skeleton.vertex\_road.element\_min\_amount](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-vertex-road-element-min-amount): There shall be at least two `<vertexRoad>` elements inside a `<polyline>` element.

* [asam.net:xodr:1.8.0:road.object.skeleton.vertex\_road.polyline\_elements](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-vertex-road-polyline-elements): There shall be no `<vertexLocal>` element next to a `<vertexRoad>` element inside the same `<polyline>` element.

* [asam.net:xodr:1.8.0:road.object.skeleton.vertex\_road.no\_radius\_with\_width\_length](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-vertex-road-no-radius-with-width-length): `<vertexRoad>` elements shall not use @radius together with @width and @length attributes in one `<polyline>` element.

* Values of @radius or @width and @length attributes will be interpolated linearly between two `<vertexRoad>` points.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.4.2, “`<vertexLocal>` element”](#sec-63c9f5b5-63d3-46ba-86fc-1a9a3f4317e8)

<a id="sec-63c9f5b5-63d3-46ba-86fc-1a9a3f4317e8"></a>
### 13.4.2. `<vertexLocal>` element

`<vertexLocal>` elements are mandatory elements inside an `<polyline>` element.
They are used to describe a more detailed form of objects inside their bounding box.
They are mutually exclusive with `<vertexRoad>` elements.
`<vertexLocal>` describe a skeleton polyline of objects within a local u/v coordinate system.

The polyline shape of an object may be described by the object’s local width and length or radius at each `<vertexLocal>` point.

**Elements in UML model**

**`<vertexLocal>` element**

In ASAM OpenDRIVE, polyline points that use local u- and v-coordinates are represented by the `<vertexLocal>` element within the `<polyline>` element.

```
UML class:  t_road_objects_object_skeleton_polyline_vertexLocal
XML tag:    <vertexLocal> (Multiplicity: 2..*)
Introduced: 1.8.0
```

Defines a vertex point on the object polyline relative to the object pivot point in local u/v-coordinates.
The insertion point and the orientation of the object are given by the @s, @t, @zOffset and @hdg attributes of the element.
`<vertexLocal>` can use either radius or length/width within one `<polyline>` element.

<a id="tab-EAID_0F01EF8E_DBAA_4f74_93BE_53686D5BA4EF"></a>
Table 93. Attributes of the <vertexLocal> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `id` | positiveInteger | optional |  | 1.8.0 | ID of the vertex point. Must be unique within one polyline. |
| `intersectionPoint` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | optional |  | 1.8.0 | Vertex point is intersecting the ground. "false" is used as default. |
| `radius` | double | optional | m | 1.8.0 | Local radius of the object at this vertex point, along the polyline |
| `u` | double | required | m | 1.8.0 | Local u-coordinate of the vertex point |
| `v` | double | required | m | 1.8.0 | Local v-coordinate of the vertex point |
| `z` | double | required | m | 1.8.0 | Local z-coordinate of the vertex point |

**XML example**

<a id="fig-7b220bcb-ef7f-40b9-ad93-66d63333b886"></a>
![img](../_images/13_objects/object_skeleton_tree.png)

Figure 118. Example of the skeleton of a tree

[Figure 118](#fig-7b220bcb-ef7f-40b9-ad93-66d63333b886) shows a leaf tree which can be described with two separate polylines, one for the trunk that defines an intersection point and one for the crown.

```
<object type="tree"
        subtype="leaf"
        name="leafTree"
        id="6"
        s="9"
        t="-5"
        zOffset="-1.00"
        roll="0"
        pitch="0"
        validLength=""
        orientation="none"
        height="7.50"
        length="4.00"
        width="4.00"
        dynamic="no"
        hdg="0">
    <skeleton>
        <polyline id="1">
            <vertexLocal u="-0.2" v="1.0" z="0" radius="0.15" id="0"/>
            <vertexLocal u="-0.2" v="1.0" z="1.000" radius="0.15" id="1" intersectionPoint="true"/>
            <vertexLocal u="-0.2" v="1.0" z="4.500" radius="0.12" id="2"/>
        </polyline>
        <polyline id="2">
            <vertexLocal u="0.0" v="0.0" z="4.0" radius="2.0" id="0"/>
            <vertexLocal u="0.0" v="0.0" z="7.5" radius="2.0" id="1"/>
        </polyline>
    </skeleton>
</object>
```

**Rules**

The following rules apply to `<vertexLocal>` elements:3

* [asam.net:xodr:1.8.0:road.object.skeleton.vertex\_local.element\_min\_amount](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-vertex-local-element-min-amount): There shall be at least two `<vertexLocal>` elements inside an `<polyline>` element.

* There shall be no `<vertexRoad>` element next to a `<vertexLocal>` element inside the same `<polyline>` element.

* [asam.net:xodr:1.8.0:road.object.skeleton.vertex\_local.vertex\_local\_elements](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-vertex-local-vertex-local-elements): `<vertexLocal>` elements shall not use @radius together with @width and @length attributes in one `<polyline>` element.

* [asam.net:xodr:1.8.0:road.object.skeleton.vertex\_local.liniear\_interpolation](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-object-skeleton-vertex-local-liniear-interpolation): Values of @radius or @width and @length attributes will be interpolated linearly between two `<vertexLocal>` points.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.4.1, “`<vertexRoad>` element”](#sec-898f3cd1-0313-4df7-921e-7f99415d2918)

## 13.5 Object material

Objects placed on a road, such as patches, may consist of a different material than the surrounding road.
Therefore, the material of the object may be defined separately.
In ASAM OpenDRIVE, it is possible to describe the surface, roughness, and friction.
The values depend on the application and are not defined in ASAM OpenDRIVE.

**Elements in UML model**

**`<material>` element**

In ASAM OpenDRIVE, the outlines of objects are represented by the `<material>` element within the `<object>` element.

```
UML class: t_road_objects_object_material
XML tag:   <material> (Multiplicity: 0..*)
```

Describes the material properties of objects, for example, patches that are part of the road surface but deviate from the standard road material.
Supersedes the material specified in the `<road material>` element and is valid only within the outline of the parent road object.

<a id="tab-EAID_0E363FA8_F8E7_4a3c_A9FF_AE3F494FC2F0"></a>
Table 94. Attributes of the <material> element

| Name | Type | Use | Introduced | Description |
| --- | --- | --- | --- | --- |
| `friction` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional |  | Friction value, depending on application |
| `roadMarkColor` | [e\_roadMarkColor](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B67AEB84_154B_4c53_979E_7F1EA9751C9E) | optional | 1.8.0 | Color of the painted road mark. |
| `roughness` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional |  | Roughness, for example, for sound and motion systems, depending on application |
| `surface` | string | optional |  | Surface material code, depending on application |

**Rules**

The following rules apply to material for objects:

* [asam.net:xodr:1.7.0:road.object.material.materials\_may\_differ](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-material-materials-may-differ): The material of objects may differ from the surrounding road.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)

## 13.6 Lane validity for objects

By default, objects are valid for all lanes of a road.
Lane validity offers the possibility to restrict the validity of an object to specific lanes only.

In ASAM OpenDRIVE, lane validity is represented by the `<validity>` element within the `<object>` element.

|  | The @orientation attribute and the `<validity>` element complement each other. The @orientation attribute and the `<validity>` element are not interchangeable. |
| --- | --- |
|  |  |

* @orientation defines the travel direction for which an object is valid.
  @orientation="+" or @orientation="-" should only be used if the object impacts traffic rules.
  Otherwise, @orientation="none" should be used.
* The `<validity>` element defines specific lanes for which an object is valid.
  It should only be used for objects which are relevant for traffic rules, for example outlines of stop lines.

**Elements in UML model**

**`<validity>` element**

```
UML class: t_road_objects_object_laneValidity
XML tag:   <validity> (Multiplicity: 0..*)
```

Lane validities restrict signals and objects to specific lanes.

<a id="tab-EAID_898D9CC9_ADA9_4992_9AB8_C13AE98C756A"></a>
Table 95. Attributes of the <validity> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `fromLane` | integer | required | Minimum ID of the lanes for which the object is valid |
| `toLane` | integer | required | Maximum ID of the lanes for which the object is valid |

**Rules**

The following rules apply to validity elements:

* An object may be valid for specified lanes.
* An object may be valid for one lane only.

* [asam.net:xodr:1.7.0:road.object.validty.check\_parent\_orientation](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-validty-check-parent-orientation): The range given by all `<validity>` elements shall be a subset of the parent’s @orientation attribute:

* [asam.net:xodr:1.7.0:road.object.validty.right\_hand\_traffic\_lane\_ids](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-validty-right-hand-traffic-lane-ids): For right-hand traffic, @orientation="+" implies that the `<validity>` element shall only span negative lane ids, while @orientation="-" implies that the `<validity>` element shall only span positive lane ids.
  If the given `<validity>` elements span both, positive and negative lane ids, @orientation="none" shall be used.

* [asam.net:xodr:1.7.0:road.object.validty.left\_hand\_traffic\_lane\_ids](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-validty-left-hand-traffic-lane-ids): For left-hand-traffic, @orientation="-" implies that the `<validity>` element shall only span negative lane ids, while @orientation="+" implies that the `<validity>` element shall only span positive lane ids.
  If the given `<validity>` elements span both, positive and negative lane ids, @orientation="none" shall be used.

* [asam.net:xodr:1.7.0:road.object.validty.from\_lower\_equal\_to](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-validty-from-lower-equal-to): The value of the @fromLane attribute shall be lower than or equal to the value of the @toLane attribute.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.10, "Object reference"](13_10_object_reference.html#top-d3896352-d768-418d-9ca7-12aadc2e2d32)

## 13.7 Access rules to parking spaces

Objects of type parking space are defined as all other object types using the @type=parkingSpace within the `<object>` element.

<a id="fig-45a862d8-0673-4c69-bf01-bc2dff99b38d"></a>
![img](../_images/13_objects/object_8.png)

Figure 119. Parking spaces rectangular (left figure) and rhomboid (right figure)

[Figure 119](#fig-45a862d8-0673-4c69-bf01-bc2dff99b38d) shows how the outline of the parking space is described by `<cornerRoad>` or `<cornerLocal>` elements.
The access to a specified parking space may be restricted to a certain group, for example handicapped persons or residents, or a certain group of vehicles, for example buses.
Further restrictions depend on the application and are user defined text.

**Elements in UML model**

**`<parkingSpace>` element**

In ASAM OpenDRIVE, access rules for parking spaces are represented by the `<parkingSpace>` element within the `<object>` element.

```
UML class: t_road_objects_object_parkingSpace
XML tag:   <parkingSpace> (Multiplicity: 0..1)
```

Details for a parking space may be added to the `<object>` element.

<a id="tab-EAID_DA7E8DAB_55D6_4a05_B6C5_A9C0902C0770"></a>
Table 96. Attributes of the <parkingSpace> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `access` | [e\_road\_objects\_object\_parkingSpace\_access](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_F7BE74C8_0856_4f3c_AF5B_E66FADE0EF06) | required | Access definitions for the parking space. Parking spaces tagged with "women" and "handicapped" are vehicles of type car. |
| `restrictions` | string | optional | Free text, depending on application |

**XML example**

* [Ex\_Parkingspace\_Rectangular.xodr](../_attachments/examples/Ex_Parkingspace/Ex_Parkingspace_Rectangular.xodr)
* [Ex\_Parkingspace\_rhomboid.xodr](../_attachments/examples/Ex_Parkingspace/Ex_Parkingspace_rhomboid.xodr)

**Rules**

The following rules apply to parkingSpace elements:

* The access to a specified parking space may be limited to a specified group of people or vehicles.
* Further access restrictions may be defined, but are not part of ASAM OpenDRIVE.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.3.1, "`<cornerRoad>` element"](13_03_object_outline.html#sec-4bfef803-e146-4f6d-86b3-533540f56b51)
* [Section 13.3.1, "`<cornerLocal>` element"](13_03_object_outline.html#sec-cc00c8a6-eea6-49e6-b90c-37b21524c748)

## 13.8 Object marking

Marking describes the road marks of any objects like crosswalks, stopping-lines, and parking spaces.
Marking is defined either in accordance to the bounding box of the element or by referencing outline points of the object.

<a id="fig-3df4f0dc-d06a-4a7e-80e6-d4c1e0028349"></a>
![img](../_images/13_objects/object_9.png)

Figure 120. Crosswalk in ASAM OpenDRIVE

[Figure 120](#fig-3df4f0dc-d06a-4a7e-80e6-d4c1e0028349) shows how a crosswalk with exemplary size is modeled.

The `<markings>` element serves as a wrapper for the `<marking>` element, which contains further information about the marking.

The marking may be defined for a straight line from one outline point to another by referencing the ID of the respective outline points.
For this purpose, the `<cornerReference>` element inside the `<marking>` element is used.

**Elements in UML model**

**`<markings>` element**

In ASAM OpenDRIVE, the markings of objects are represented by the `<markings>` element within the `<object>` element.

```
UML class: t_road_objects_object_markings
XML tag:   <markings> (Multiplicity: 0..1)
```

Object markings are road markings of any objects, for example, crosswalks, stopping-lines, and parking spaces.

**`<marking>` element**

In ASAM OpenDRIVE, a single marking is represented by the `<marking>` element within the `<markings>` element.

```
UML class: t_road_objects_object_markings_marking
XML tag:   <marking> (Multiplicity: 1..*)
```

Specifies a marking that is either attached to one side of the object bounding box or referencing outline points.

<a id="tab-EAID_BFFDF8F3_C18F_4bbe_BC97_6AAD9E05BCA1"></a>
Table 97. Attributes of the <marking> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `color` | [e\_roadMarkColor](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B67AEB84_154B_4c53_979E_7F1EA9751C9E) | required |  | Color of the marking |
| `lineLength` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | required | m | Length of the visible part |
| `side` | [e\_sideType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_41CC10F3_DCBB_4d99_A542_421B9C6015D5) | required |  | Side of the bounding box described in `<object>` element in the local coordinate system u/v |
| `spaceLength` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Length of the gap between the visible parts |
| `startOffset` | double | required | m | Lateral offset in u-direction from start of bounding box side where the first marking starts |
| `stopOffset` | double | required | m | Lateral offset in u-direction from end of bounding box side where the marking ends |
| `weight` | [e\_roadMarkWeight](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_239940A3_B976_4a17_BD54_8252EACCC1FD) | optional |  | Optical "weight" of the marking |
| `width` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | optional | m | Width of the marking |
| `zOffset` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m | Height of road mark above the road, i.e. thickness of the road mark |

**`<cornerReference>` element**

In ASAM OpenDRIVE, a corner reference is represented by the `<cornerReference>` element within the `<marking>` element.

```
UML class: t_road_objects_object_markings_marking_cornerReference
XML tag:   <cornerReference> (Multiplicity: 0..*)
```

Specifies a point by referencing an existing outline point.

<a id="tab-EAID_D8E7B2C4_FF14_47ae_B6C0_C8482918D85D"></a>
Table 98. Attributes of the <cornerReference> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `id` | nonNegativeInteger | required | Identifier of the referenced outline point |

**XML example**

```
<objects>
    <object type="crosswalk"
            id="10"
            s="10.0"
            t="0.0"
            zOffset="0.0"
            orientation="none"
            length="10.0"
            width="7.0"
            hdg="0.0"
            pitch="0.0"
            roll="0.0">
        <outlines>
            <outline id="0">
                <cornerRoad s="5.0" t="3.5" dz="0.0" height="4.0" id="0"/>
                <cornerRoad s="8.0" t="-3.5" dz="0.0" height="4.0" id="1"/>
                <cornerRoad s="12.0" t="-3.5" dz="0.0" height="4.0" id="2"/>
                <cornerRoad s="15.0" t="3.5" dz="0.0" height="4.0" id="3"/>
            </outline>
        </outlines>
        <markings>
            <marking width="0.1"
                     color="white"
                     zOffset="0.005"
                     spaceLength ="0.05"
                     lineLength ="0.2"
                     startOffset="0.0"
                     stopOffset="0.0">
                <cornerReference id="0"/>
                <cornerReference id="1"/>
            </marking>
            <marking width="0.1"
                     color="white"
                     zOffset="0.005"
                     spaceLength ="0.05"
                     lineLength ="0.2"
                     startOffset="0.0"
                     stopOffset="0.0">
                <cornerReference id="2"/>
                <cornerReference id="3"/>
            </marking>
        </markings>
    </object>
</objects>
```

**Rules**

The following rules apply to object marking elements:

* The marking of an object shall either completely or partially be defined on its outline.

* [asam.net:xodr:1.7.0:road.object.marking.colour](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-marking-colour): The color of the marking shall be defined.

* [asam.net:xodr:1.7.0:road.object.marking.no\_outline\_side\_attr](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-marking-no-outline-side-attr): If no outline is used, the @side attribute is mandatory.

* [asam.net:xodr:1.7.0:road.object.marking.outline\_corner\_reference\_count](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-marking-outline-corner-reference-count): If an outline is used, at least two `<cornerReference>` elements are mandatory.

* [asam.net:xodr:1.7.0:road.object.marking.no\_cornerreference\_if\_no\_outline](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-marking-no-cornerreference-if-no-outline): If no outline is used, the `<cornerReference>` element cannot be used.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.3, "Object outline"](13_03_object_outline.html#top-67295042-9707-4ad5-9671-b80cde49bb3a)
* [Section 13.9, "Object borders"](13_09_object_borders.html#top-f4d6c702-996e-4344-8e80-e580ea6ca767)

## 13.9 Object borders

Objects may have a border, that is a frame of a defined width.
Different border types are available, currently concrete and curb, for example for traffic islands.

The `<borders>` element serves as a wrapper for the `<border>` element, which itself contains further attributes to describe the borders.

**Elements in UML model**

**`<borders>` element**

In ASAM OpenDRIVE, object borders are represented by the `<borders>` element within the `<object>` element.

```
UML class: t_road_objects_object_borders
XML tag:   <borders> (Multiplicity: 0..1)
```

Object borders are frames with a defined width, for example, to describe traffic islands.

Different border types are available.

**`<border>` element**

In ASAM OpenDRIVE, object borders are represented by the `<border>` element within the `<borders>` element.

```
UML class: t_road_objects_object_borders_border
XML tag:   <border> (Multiplicity: 1..*)
```

Specifies a border along certain outline points.

<a id="tab-EAID_1E525C5E_6534_4ca9_A56F_BAE740559FF4"></a>
Table 99. Attributes of the <border> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `outlineId` | nonNegativeInteger | required |  | ID of the outline to use |
| `type` | [e\_borderType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_2D816E93_925F_4971_9AA2_C88571AE7C5E) | required |  | Appearance of border |
| `useCompleteOutline` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | optional |  | Use all outline points for border. “true” is used as default. |
| `width` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Border width |

**Rules**

The following rules apply to object borders:

* [asam.net:xodr:1.7.0:road.object.borders.useCompleteOutline\_true](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-borders-usecompleteoutline-true): If @useCompleteOutline is true, the `<cornerReference>` element shall not be defined.

* If @useCompleteOutline is false, at least two `<cornerReference>` elements are mandatory.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.3, "Object outline"](13_03_object_outline.html#top-67295042-9707-4ad5-9671-b80cde49bb3a)
* [Section 13.8, "Object marking"](13_08_object_marking.html#top-c25542c0-f80d-4da9-a430-020474b58301)

## 13.10 Object reference

It is possible to link an object with one or more roads, signals, or other objects.
These links represent a logical connection between the two elements.

An object reference is used, for example, if a pedestrian crossing crosses several roads.
In this case, the pedestrian crossing is defined for one road only, and then referenced by the other roads that it crosses.
Objects that apply to multiple roads within a junction can alternatively be attached to the junction reference line.

The lane validity element may be used to indicate for which lane the object reference is valid.

**Elements in UML model**

**`<objectReference>` element**

In ASAM OpenDRIVE, the object reference is represented by the `<objectReference>` element within the `<objects>` element.

```
UML class: t_road_objects_objectReference
XML tag:   <objectReference> (Multiplicity: 0..*)
```

An object reference refers to one identical object from multiple roads.
The referenced objects require a unique ID.
The `<objectReference>` element consists of a main element and an optional lane validity element.

<a id="tab-EAID_9F6CEE0C_4F3B_47b6_B849_FDBA2AB35464"></a>
Table 100. Attributes of the <objectReference> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `id` | string | required |  | Unique ID of the referred object within the database |
| `orientation` | [e\_orientation](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D8972119_8CE4_407e_A4AD_3183B0B5C687) | required |  | "+" = valid in positive s-direction "-" = valid in negative s-direction "none" = valid in both directions |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | s-coordinate |
| `t` | double | required | m | t-coordinate |
| `validLength` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m | Validity of the object along s-axis (0.0 for point object) |
| `zOffset` | double | optional | m | z offset relative to the elevation of the road reference line |

**`<validity>` element**

In ASAM OpenDRIVE, lane validity is represented by the `<validity>` element within the `<object>` element or the `<objectReference>` element.

```
UML class: t_road_objects_object_laneValidity
XML tag:   <validity> (Multiplicity: 0..*)
```

Lane validities restrict signals and objects to specific lanes.

<a id="tab-EAID_898D9CC9_ADA9_4992_9AB8_C13AE98C756A"></a>
Table 101. Attributes of the <validity> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `fromLane` | integer | required | Minimum ID of the lanes for which the object is valid |
| `toLane` | integer | required | Maximum ID of the lanes for which the object is valid |

**Rules**

The following rules apply for the purpose of reusing object information:

* [asam.net:xodr:1.7.0:road.object.reference.from\_lower\_equal\_to](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-reference-from-lower-equal-to): The value of the @fromLane attribute shall be lower than or equal to the value of the @toLane attribute.

**Related topics**

* [Section 13.1, "Introduction to objects"](13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
* [Section 13.6, "Lane validity for objects"](13_06_lane_validity_obj.html#top-4f4a9920-bb53-4f67-ac57-afe4b23c1775)

## 13.11 Tunnels

Tunnels are modeled as objects in ASAM OpenDRIVE.
The road with the tunnel object defines the part of the road that is the tunnel or the underpass.
By definition, tunnels are valid for the complete cross section of a road.
Tunnels are described by a starting point, a length and a type, for example, if the tunnel represents an underpass and is open to daylight.
Additional properties may define the light conditions.

<a id="fig-28dd5e95-118e-4567-b8e9-f8ad898fd79b"></a>
![img](../_images/13_objects/object_10.png)

Figure 121. Tunnel

[Figure 121](#fig-28dd5e95-118e-4567-b8e9-f8ad898fd79b) shows a tunnel that is valid for the whole cross section of the road and that defines the part that is the tunnel.

**Elements in UML model**

**`<tunnel>` element**

In ASAM OpenDRIVE, tunnels are represented by the `<tunnel>` element within the `<objects>` element.

```
UML class: t_road_objects_tunnel
XML tag:   <tunnel> (Multiplicity: 0..*)
```

Tunnels are modeled as objects in ASAM OpenDRIVE.
The road with the tunnel object defines the part of the road that is the tunnel or the underpass.

Tunnels are valid for the complete cross section of a road unless a lane validity element with further restrictions is provided as child element

<a id="tab-EAID_9F7C7E88_2B94_447c_AAB0_76C4E914EA9E"></a>
Table 102. Attributes of the <tunnel> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `daylight` | [t\_zeroOne](../16_annexes/map_uml_data_types.html#top-EAID_AB1F001B_EB35_4c0d_84DF_A629F108D352) | optional |  | Degree of daylight intruding the tunnel. Depends on the application. |
| `id` | string | required |  | Unique ID within database |
| `length` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Length of the tunnel (in s-direction) |
| `lighting` | [t\_zeroOne](../16_annexes/map_uml_data_types.html#top-EAID_AB1F001B_EB35_4c0d_84DF_A629F108D352) | optional |  | Degree of artificial tunnel lighting. Depends on the application. |
| `name` | string | optional |  | Name of the tunnel. May be chosen freely. |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | s-coordinate |
| `type` | [e\_tunnelType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_0337D9C2_71FE_4896_9D80_BEF871FA0D8B) | required |  | Type of tunnel |

**`<validity>` element**

In ASAM OpenDRIVE, lane validity is represented by the `<validity>` element within the `<object>` element.

```
UML class: t_road_objects_object_laneValidity
XML tag:   <validity> (Multiplicity: 0..*)
```

Lane validities restrict signals and objects to specific lanes.

<a id="tab-EAID_898D9CC9_ADA9_4992_9AB8_C13AE98C756A"></a>
Table 103. Attributes of the <validity> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `fromLane` | integer | required | Minimum ID of the lanes for which the object is valid |
| `toLane` | integer | required | Maximum ID of the lanes for which the object is valid |

**XML example**

```
<objects>
    <tunnel s="50.0"
            length="100.0"
            name="ExampleTunnel"
            id="1"
            type="standard"
            lighting="0.2"
            daylight="0.9"/>
</objects>
```

**Rules**

The following rules apply to tunnel elements:

* Tunnels may be restricted to certain lanes, using the `<laneValidity>` element.

* [asam.net:xodr:1.7.0:road.object.tunnels.type\_definition](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-tunnels-type-definition): The @type of the tunnel shall be specified.

* [asam.net:xodr:1.7.0:road.object.tunnels.from\_lower\_equal\_to](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-tunnels-from-lower-equal-to): The value of the @fromLane attribute shall be lower than or equal to the value of the @toLane attribute.

**Related topics**

* [Section 10.2, "Properties for road sections and cross section"](../10_roads/10_02_properties_for_road_sections.html#top-1323a74c-b102-4fdd-bc02-63265f034f45)
* [Section 13.6, "Lane validity for objects"](13_06_lane_validity_obj.html#top-4f4a9920-bb53-4f67-ac57-afe4b23c1775)
* [Section 13.12, "Bridges"](13_12_bridges.html#top-b65d5a80-f80f-415d-9188-349726023b4a)

## 13.12 Bridges

Bridges are modeled as objects in ASAM OpenDRIVE.
The road with the bridge object leads over a bridge.
By definition, bridges are valid for the complete cross section of a road.
Bridges are described by a starting point, a length, and a type, such as concrete, steel, wood, or brick.

<a id="fig-b1cce70a-c3fd-4b87-be73-4d60ba0f997d"></a>
![img](../_images/13_objects/object_11.png)

Figure 122. Bridge

[Figure 122](#fig-b1cce70a-c3fd-4b87-be73-4d60ba0f997d) shows a bridge that is valid for the whole cross section of the road and that defines the part that is the bridge.

**Elements in UML model**

**`<bridge>` element**

In ASAM OpenDRIVE, bridges are represented by the `<bridge>` element within the `<objects>` element.

```
UML class: t_road_objects_bridge
XML tag:   <bridge> (Multiplicity: 0..*)
```

Bridges are modeled as objects in ASAM OpenDRIVE.
The road with the bridge object leads over a bridge.
Bridges are valid for a road’s complete cross section unless a lane validity record with further restrictions is provided as child element.

<a id="tab-EAID_F9D3A28E_9FAA_4396_B721_43F668F1EEC6"></a>
Table 104. Attributes of the <bridge> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `id` | string | required |  | Unique ID within database |
| `length` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Length of the bridge (in s-direction) |
| `name` | string | optional |  | Name of the bridge. May be chosen freely. |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | s-coordinate |
| `type` | [e\_bridgeType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_C4877BA5_2D1C_4d4a_A8AF_70B59039EBDA) | required |  | Type of bridge |

**`<validity>` element**

In ASAM OpenDRIVE, lane validity is represented by the `<validity>` element within the `<object>` element.

```
UML class: t_road_objects_object_laneValidity
XML tag:   <validity> (Multiplicity: 0..*)
```

Lane validities restrict signals and objects to specific lanes.

<a id="tab-EAID_898D9CC9_ADA9_4992_9AB8_C13AE98C756A"></a>
Table 105. Attributes of the <validity> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `fromLane` | integer | required | Minimum ID of the lanes for which the object is valid |
| `toLane` | integer | required | Maximum ID of the lanes for which the object is valid |

**XML example**

```
<objects>
    <bridge s="50.0 "
            length="100.0"
            name="ExampleBridge"
            id="1"
            type="concrete"/>
</objects>
```

**Rules**

The following rules apply to bridge elements:

* [asam.net:xodr:1.7.0:road.object.bridges.define\_type](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-bridges-define-type): Bridges may be restricted to certain lanes, using the `<laneValidity>` element.

* [asam.net:xodr:1.7.0:road.object.bridges.type\_definition](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-bridges-type-definition): The @type of the tunnel shall be specified.

* [asam.net:xodr:1.7.0:road.object.bridges.from\_lower\_equal\_to](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-bridges-from-lower-equal-to): The value of the @fromLane attribute shall be lower than or equal to the value of the @toLane attribute.

**Related topics**

* [Section 10.2, "Properties for road sections and cross section"](../10_roads/10_02_properties_for_road_sections.html#top-1323a74c-b102-4fdd-bc02-63265f034f45)
* [Section 13.6, "Lane validity for objects"](13_06_lane_validity_obj.html#top-4f4a9920-bb53-4f67-ac57-afe4b23c1775)

## 13.13 Object CRG surface

In driving simulators, the driver should be able to feel both the general road surface and specific, visible features on the road.
This includes manhole covers, cracks, and patches.
However, these require different resolutions, and it is impractical to model the entire road surface with a fine grid.

To support high-resolution surface features on a low-resolution road, the `<surface>` element may be included within the `<object>` element.

Objects with a defined `<surface>` element influence the height of the road, including elevation, lateral profile, interpolated elevation grid, and lane height.
The object’s surface height is added to the road height.
In the other direction, it is subtracted if the object’s surface height is negative.

Because CRG data may only cover parts of a road’s surface, it must be made sure that the elevation information derived from ASAM OpenDRIVE data can still be used outside of the valid CRG area.
Because the reference line of the CRG file for an object is ignored, a CRG file may be referenced multiple times in different parts of the map.
The local coordinate system of an object is rotated with the object.
The object surface is thus also rotated.

<a id="fig-bfdad4a4-9b91-4142-9e3f-1693c7512443"></a>
![img](../_images/13_objects/object_12.png)

Figure 123. CRG for objects

[Figure 123](#fig-bfdad4a4-9b91-4142-9e3f-1693c7512443) shows how CRG for objects is applied.
s/t is the road reference line coordinate system.
u/v is the CRG coordinate system.
The object’s center point is defined as the origin of the CRG coordinate system, which results in positive and negative u/v values.

**Elements in UML model**

**`<surface>` element**

In ASAM OpenDRIVE, object surfaces are represented by the `<surface>` element within the `<object>` element.

```
UML class:  t_road_objects_object_surface
XML tag:    <surface> (Multiplicity: 0..1)
Introduced: 1.7.0
```

Used to describe the road surface elevation of an object.

**`<CRG>` element**

In ASAM OpenDRIVE, ASAM OpenCRG data of object surfaces is represented by the <CRG> element within the <surface> element.

```
UML class:  t_road_objects_object_surface_CRG
XML tag:    <CRG> (Multiplicity: 0..1)
Introduced: 1.7.0
```

Elevation data described in ASAM OpenCRG are represented by the `<CRG>` element within the `<surface>` element.

<a id="tab-EAID_8DCC2D0B_B5AC_4045_AE30_881ADC57552B"></a>
Table 106. Attributes of the <CRG> element

| Name | Type | Use | Introduced | Description |
| --- | --- | --- | --- | --- |
| `file` | string | required | 1.7.0 | Name of the file containing the CRG data. |
| `hideRoadSurfaceCRG` | [t\_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E) | required | 1.7.0 | Determines if the object CRG hides the road surface CRG. Default is true. |
| `zScale` | double | required | 1.7.0 | z-scale factor for the surface description (default = 1.0). |

**XML example**

```
<surface>
    <CRG file="manhole_cover.crg" hideRoadSurfaceCRG="true" zScale="1"></CRG>
</surface>
```

**Calculation**

If an ASAM OpenCRG file is referenced, the u/v coordinates of the object are used directly as u/v coordinates of the ASAM OpenCRG file.
The reference line of the CRG file is unused.

Thus, the surface height of an object is calculated as follows, using the `crgEvaluv2z` function from the ASAM OpenCRG C-API:

\[\operatorname{objectSurfaceHeight}(object, u, v) = \operatorname{crgEvaluv2z}(crg, u, v) \* z\_{Scale}\]

The total height at the point of an object CRG depends on the attachment mode of the underlying road surface CRG (`t_road_surface_CRG`), provided there is one.

<a id="tab-bea7d535-f628-4299-a083-8fee726cea2"></a>
Table 107. Total height calculation by attachment mode

| Road surface CRG attachment mode | hideRoadSurfaceCRG = true (default) | hideRoadSurfaceCRG = false |
| --- | --- | --- |
| attached | OpenDRIVE height + object CRG ![400](../_images/13_objects/object_14.png) | OpenDRIVE height + road surface CRG + object CRG ![400](../_images/13_objects/object_13.png) |
| attached0, genuine, global | not allowed ![400](../_images/13_objects/object_16.png) | road surface CRG + object CRG ![400](../_images/13_objects/object_15.png) |
| no road surface CRG | OpenDRIVE height + object CRG ![400](../_images/13_objects/object_17.png) | OpenDRIVE height + object CRG ![400](../_images/13_objects/object_17.png) |

[Table 108](#tab-bea7d535-f628-4299-a083-8fee726cea2) summarizes the calculations for the different combinations.
For a review of attachment modes, see [Table 32](../10_roads/10_06_road_surface.html#tab-8dd4bfa6-b06a-48be-8044-07887e2e811a), "Modes of connecting ASAM OpenCRG to ASAM OpenDRIVE" in  [Section 10.6, "Road CRG surface"](../10_roads/10_06_road_surface.html#top-7a0a2c4b-41a6-46e6-845e-932f2a014730).

If `crgEvaluv2z` returns NaN, then the object has no defined height at that position.
This is allowed in ASAM OpenCRG.
In this case, the height of the road at that position shall be identical to the height defined in the rest of this standard, as if the object CRG were not present.
The @hideRoadSurfaceCRG attribute has no effect at positions where `crgEvaluv2z` returns NaN.
This enables the use of non-rectangular objects together with the @hideRoadSurfaceCRG attribute, for example, manhole covers.

**Rules**

The following rules apply to the use of CRG data in objects:

* [asam.net:xodr:1.7.0:road.object.surface.only\_for\_angular\_boxes](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-only-for-angular-boxes): Only objects with angular bounding boxes may contain `<surface>` elements. Circular objects or objects with `<outlines>` elements shall not contain `<surface>` elements.

* Outside the bounding box, CRG data from the object shall be ignored.

* [asam.net:xodr:1.7.0:road.object.surface.no\_bounding\_box\_overlap](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-no-bounding-box-overlap): The bounding boxes of objects with `<surface>` elements shall not overlap.

* [asam.net:xodr:1.7.0:road.object.surface.identical\_local\_coordinates](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-identical-local-coordinates): The local coordinate system of the CRG shall be identical to the local coordinate system of the object to which it belongs. The reference line, inertial position, curvature, and heading of the CRG file shall be ignored.

* [asam.net:xodr:1.7.0:road.object.surface.object\_reference\_on\_overlap](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-object-reference-on-overlap): An object with a `<surface>` element shall be referenced on all roads it overlaps, using `<object>` and `<objectReference>` elements.

* [asam.net:xodr:1.7.0:road.object.surface.only\_one\_crg\_file](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-only-one-crg-file): An object shall not reference more than one CRG file.

* [asam.net:xodr:1.7.0:road.object.surface.repeat\_discretely\_not\_continously](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-repeat-discretely-not-continously): Objects with `<surface>` elements may repeat discretely, but not continuously. See  [Section 13.2, "Repeating objects"](13_02_repeating_objects.html#top-fc693ed2-a38b-4cfc-a346-90c8a478bfd0).

* To avoid skewed CRG surfaces, the @perpToRoad attribute should only be used for objects that are smaller than the local radius of the curvature of the road elevation.
* The @height and @zOffset attributes of an object with a `<surface>` element shall be ignored when calculating the surface elevation.

* [asam.net:xodr:1.7.0:road.object.surface.crg\_hidden\_on\_object\_overlap](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-crg-hidden-on-object-overlap): If a road surface CRG is present, that is, the CRG area overlaps the bounding box of the object and has any mode other than attached, then @hideRoadSurfaceCRG shall be false. True shall not be allowed.

* [asam.net:xodr:1.7.0:road.object.surface.calculate\_road\_height](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-object-surface-calculate-road-height): If `crgEvaluv2z` returns NaN, then the road height at that position shall be the ASAM OpenDRIVE height in addition to the road surface CRG, if it is present. The value of @hideRoadSurfaceCRG attribute shall have no influence.The value of @hideRoadSurfaceCRG attribute shall have no influence.

**Related topics**

* [Section 10.6, "Road CRG surface"](../10_roads/10_06_road_surface.html#top-7a0a2c4b-41a6-46e6-845e-932f2a014730)
* [Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

## 13.14 Combinations of elements and attributes for object types

<a id="_barrier"></a>
### 13.14.1 barrier

A barrier is a continuous roadside object, which cannot be passed.

<a id="tab-cc3870b3-96ad-43bf-bb27-6b43187a5402"></a>
Table 108. Combinations of attributes and elements for <object type="barrier">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<skeleton>` `<marking>` `<border>` `<material>` `<surface>` `<parkingSpace>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| barrier | hedge | common hedge made out of vegetation and bushes without gaps | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |
| barrier | guardRail | metal guard rail along the side of the road (without the vertical poles) | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |
| barrier | jerseyBarrier | lower wall mostly made out of concrete to separate driving lanes | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |
| barrier | wall | higher wall out of concrete, bricks, stones …​ | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |
| barrier | railing | any kind of railing along the roadside | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |
| barrier | fence | metal or wooden fence | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |
| barrier | noiseProtections | higher wall for noise protection | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |
| barrier | other | all other barrier objects subtypes that do not fit into current categories | not allowed | not recommended | recommended, size is defined in `<repeat>` | not allowed | optional, default value for @closed="false" | not allowed |

**XML example**

```
<object type="barrier"
        subtype="guardRail"
        name="guardRail"
        id="4000203"
        s="7.4615629425e+01"
        t="-1.4796332056e+01"
        zOffset="-0.328297280316"
        validLength="78.2913194973"
        orientation="none">
    <repeat s="7.4615629425e+01"
            length="2.2248725912e+00"
            distance="0.0000000000e+00"
            tStart="-1.4796332056e+01"
            tEnd="-1.4797490375e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="-3.2829728032e-01"
            zOffsetEnd="-2.0316925494e-01" />
    <repeat s="7.6840502016e+01"
            length="1.9924939859e+00"
            distance="0.0000000000e+00"
            tStart="-1.4797490375e+01"
            tEnd="-1.4799675135e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="-2.0316925494e-01"
            zOffsetEnd="-9.9028462309e-02" />
    <repeat s="7.8832996002e+01"
            length="3.3472807403e+00"
            distance="0.0000000000e+00"
            tStart="-1.4799675135e+01"
            tEnd="-1.4796827566e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="-9.9028462309e-02"
            zOffsetEnd="5.4099928501e-02" />
    <repeat s="8.2180276743e+01"
            length="2.0283762167e+00"
            distance="0.0000000000e+00"
            tStart="-1.4796827566e+01"
            tEnd="-1.4790365646e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="5.4099928501e-02"
            zOffsetEnd="1.2659902980e-01" />
    <repeat s="8.4208652959e+01"
            length="8.1152058043e+00"
            distance="0.0000000000e+00"
            tStart="-1.4790365646e+01"
            tEnd="-1.4802913672e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.2659902980e-01"
            zOffsetEnd="1.7346901590e-01" />
    <repeat s="9.2323858764e+01"
            length="8.1137326328e+00"
            distance="0.0000000000e+00"
            tStart="-1.4802913672e+01"
            tEnd="-1.4932009665e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.7346901590e-01"
            zOffsetEnd="1.8665641186e-01" />
    <repeat s="1.0043759140e+02"
            length="8.1135361793e+00"
            distance="0.0000000000e+00"
            tStart="-1.4932009665e+01"
            tEnd="-1.4813360696e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.8665641186e-01"
            zOffsetEnd="1.7471050187e-01" />
    <repeat s="1.0855112758e+02"
            length="8.1144815334e+00"
            distance="0.0000000000e+00"
            tStart="-1.4813360696e+01"
            tEnd="-1.4794688826e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.7471050187e-01"
            zOffsetEnd="1.6260260750e-01" />
     <repeat s="1.1666560911e+02"
            length="8.1145989742e+00"
            distance="0.0000000000e+00"
            tStart="-1.4794688826e+01"
            tEnd="-1.4789712834e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.6260260750e-01"
            zOffsetEnd="1.5562310985e-01" />
     <repeat s="1.2478020808e+02"
            length="8.1144823549e+00"
            distance="0.0000000000e+00"
            tStart="-1.4789712834e+01"
            tEnd="-1.4785309018e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.5562310985e-01"
            zOffsetEnd="1.4723730991e-01" />
     <repeat s="1.3289469044e+02"
            length="8.1147823670e+00"
            distance="0.0000000000e+00"
            tStart="-1.4785309018e+01"
            tEnd="-1.4796174945e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.4723730991e-01"
            zOffsetEnd="1.7293727744e-01" />
     <repeat s="1.4100947281e+02"
            length="2.9774693217e+00"
            distance="0.0000000000e+00"
            tStart="-1.4796174945e+01"
            tEnd="-1.4801054064e+01"
            widthStart="1.0000000000e-01"
            widthEnd="1.0000000000e-01"
            heightStart="3.0000000000e-01"
            heightEnd="3.0000000000e-01"
            zOffsetStart="1.7293727744e-01"
            zOffsetEnd="1.9761954152e-01" />
</object>
```

<a id="_building"></a>
### 13.14.2 building

A building is a closed object, which cannot be passed.

<a id="tab-e73d85da-cdb9-4040-b33b-4f33a8ceb1c4"></a>
Table 109. Combinations of attributes and elements for <object type="building">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<skeleton>` `<marking>` `<border>` `<material>` `<surface>` `<parkingSpace>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| building | building | regular building like a house or office | optional | recommended | not allowed | optional | optional, default value for @closed="true" | not allowed |
| building | busStop | bus stop with little roof and sign | optional | recommended | not allowed | optional | optional, default value for @closed="true" | not allowed |
| building | tollBooth | small building with a barrier to collect tolls or charges | optional | recommended | not allowed | optional | optional, default value for @closed="true" | not allowed |
| building | other | all other building objects subtypes that do not fit into current categories | optional | recommended | not allowed | optional | optional, default value for @closed="true" | not allowed |

**XML example**

```
<object type="building"
        subType="building"
        name="house"
        id="0"
        s="2.4028125000000038e+01"
        t="1.2802136334240046e+01"
        zOffset="4.9999999999998934e-03"
        orientation="none"
        length="1.1300000000000001e+01"
        width="9.9900000000000002e+00"
        height="1.2230000000000000e+01"
        hdg="2.6413812899682183e+00"
        pitch="0.0000000000000000e+00"
        roll="0.0000000000000000e+00">
</object>
```

<a id="_crosswalk"></a>
### 13.14.3 crosswalk

A crosswalk is an object on the road that can be passed.
It is recommended to be defined as `<crossPath>` within a junction for pedestrian/bicycle simulation.
If the crosswalk is defined as an object only, it will not be used for pedestrian/bicycle simulation.

<a id="tab-ab48a559-2129-4b40-8498-941652296efc"></a>
Table 110. Combinations of attributes and elements for <object type="crosswalk">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<marking>` `<surface>` `<material>` | `<skeleton>` `<border>` `<parkingSpace>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| crosswalk | pedestrian | pedestrian crosswalk without zebra markings | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| crosswalk | bicycle | bicycle crossing, in Germany normally with red paint | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| crosswalk | zebra | zebra crossing | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| crosswalk | virtual | invisible crosswalk | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | not recommended | not allowed |
| crosswalk | other | all other crosswalk objects subtypes that do not fit into current categories | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |

**XML example**

```
<object type="crosswalk"
        id="10"
        s="10.0"
        t="0.0"
        zOffset="0.0"
        orientation="none"
        length="10.0"
        width="7.0"
        hdg="0.0"
        pitch="0.0"
        roll="0.0">
    <outlines>
        <outline id="0" closed="true">
            <cornerRoad s="5.0" t="3.5" dz="0.0" height="0.0" id="0"/>
            <cornerRoad s="8.0" t="-3.5" dz="0.0" height="0.0" id="1"/>
            <cornerRoad s="12.0" t="-3.5" dz="0.0" height="0.0" id="2"/>
            <cornerRoad s="15.0" t="3.5" dz="0.0" height="0.0" id="3"/>
        </outline>
    </outlines>
    <markings>
        <marking width="0.1"
                 color="white"
                 zOffset="0.005"
                 spaceLength ="0.05"
                 lineLength ="0.2"
                 startOffset="0.0"
                 stopOffset="0.0">
            <cornerReference id="0"/>
            <cornerReference id="1"/>
        </marking>
        <marking width="0.1"
                 color="white"
                 zOffset="0.005"
                 spaceLength ="0.05"
                 lineLength ="0.2"
                 startOffset="0.0"
                 stopOffset="0.0">
            <cornerReference id="2"/>
            <cornerReference id="3"/>
        </marking>
    </markings>
</object>
```

<a id="_gantry"></a>
### 13.14.4 gantry

A gantry is an object above a road on which `<signals>` are placed.

<a id="tab-f76829ba-511f-4fe4-b67d-9d3b77869cdd"></a>
Table 111. Combinations of attributes and elements for <object type="gantry">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<skeleton>` | `<marking>` `<border>` `<material>` `<surface>` `<parkingSpace>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| gantry | gantry | has poles on either side of lanes and an overhead construction between them | not allowed | mandatory, for the entire gantry | not allowed | optional | not recommended, default value for @closed="true" | recommended, recommended to use `<polyline>`, of which first vertex and last vertex have @intersectionPoint | not allowed |
| gantry | gantryHalf | has a pole on one side of the road and an overhead construction attached to it | not allowed | mandatory, for the entire gantry | not allowed | optional | not recommended, default value for @closed="true" | recommended, recommended to use `<polyline>`, of which first vertex has an @intersectionPoint | not allowed |
| gantry | other | all other gantry objects subtypes that do not fit into current categories | not allowed | mandatory, for the entire gantry | not allowed | optional | not recommended, default value for @closed="true" | recommended | not allowed |

**XML example**

```
<object type="gantry"
        subtype="gantry"
        name="SignGantry"
        id="4000001"
        s="25.0"
        t="-3.0"
        zOffset="0.00"
        roll="0"
        pitch="0"
        validLength=""
        orientation="none"
        height="5.5"
        length="0.5"
        width="6.5"
        dynamic="no"
        hdg="0">
    <skeleton>
        <polyline id="1">
            <vertexRoad s="25.0"
                        t="0.0"
                        dz="0.0"
                        width="0.5"
                        length="0.5"
                        id="0"
                        intersectionPoint="true" />
            <vertexRoad s="25.0"
                        t="0.0"
                        dz="5.25"
                        width="0.5"
                        length="0.5"
                        id="1" />
            <vertexRoad s="25.0"
                        t="-6.0"
                        dz="5.25"
                        width="0.5"
                        length="0.5"
                        id="2" />
            <vertexRoad s="25.0"
                        t="-6.0"
                        dz="0.0"
                        width="0.5"
                        length="0.5"
                        id="3"
                        intersectionPoint="true" />
        </polyline>
    </skeleton>
</object>
```

<a id="_obstacle"></a>
### 13.14.5 obstacle

An obstacle is an object on or beside the road that cannot be passed.

<a id="tab-4cf3c33c-d21a-4790-8d2b-931f7863e31b"></a>
Table 112. Combinations of attributes and elements for <object type="obstacle">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<skeleton>` `<marking>` `<border>` `<material>` `<surface>` `<parkingSpace>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| obstacle | advertisingColumn |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | art |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | seating |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | picknick |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | box |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | phonebooth |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | chargingStation |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | distributionBox | for example, electrical, communication | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | crashBox |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | dumpster |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | dustbin |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | fountain |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | gritContainer |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | hydrant |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | parkingMeter |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | pillar | for example, bridge pillars | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | plantPot |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | postBox |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | railing | for example, bicycle stand, handrail | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | rock |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | roadBlockage |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | wall |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | fence |  | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| obstacle | other | all other obstacle objects subtypes that do not fit into current categories | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |

**XML example**

```
<object type="obstacle"
        subType="hydrant"
        name="GermanHydrant"
        id="1"
        s="8.3817187499999548e+01"
        t="-4.6359023698365620e+00"
        zOffset="0.0000000000000000e+00"
        orientation="none"
        radius="1.500000000000000e-01"
        height="1.2520000000000000e+00"
        hdg="0.0000000000000000e+00"
        pitch="0.0000000000000000e+00"
        roll="0.0000000000000000e+00">
</object>
```

<a id="_parkingspace"></a>
### 13.14.6 parkingSpace

A parkingSpace is an object on a lane on which vehicles are parked.

<a id="tab-2d024d5a-c6c8-48cd-b059-8ce7d0c5aba9"></a>
Table 113. Combinations of attributes and elements for <object type="parkingSpace">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<parkingSpace>` `<material>` `<marking>` `<surface>` | `<skeleton>` `<border>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| parkingSpace | openSpace | typically outdoors, no limit to the top | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| parkingSpace | closedSpace | typically indoors, limit to the top for example, inside a building | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| parkingSpace | other | all other parkingSpace objects subtypes that do not fit into current categories | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |

**XML example**

```
<object type="parkingSpace"
        subtype="open"
        name="parkingSpace_50deg"
        id="9"
        s="1.5e+01" t="-6.0e+00"
        zOffset="0.0"
        orientation="+"
        length="6.04e+00"
        width="2.5e+00"
        height="0.0"
        hdg="5.41052e+00"
        pitch="0.0"
        roll="0.0">
    <outlines>
        <outline id="51" closed="true">
            <cornerRoad s="11.60" t="-4.00" dz="0.001" height="0.0" id="0">
            <cornerRoad s="15.25" t="-8.15" dz="0.001" height="0.0" id="1">
            <cornerRoad s="18.39" t="-8.15" dz="0.001" height="0.0" id="2">
            <cornerRoad s="15.14" t="-4.00" dz="0.001" height="0.0" id="3">
        </outline>
    </outlines>
    <markings>
        <marking width="0.1"
                 color="white"
                 zOffset="0.005"
                 spaceLength="0.0"
                 lineLength="1.0"
                 startOffset="0.0"
                 stopOffset="0.0">
            <cornerReference id="0"/>
            <cornerReference id="1"/>
        </marking>
        <marking width="0.1"
                 color="white"
                 zOffset="0.005"
                 spaceLength="0.0"
                 lineLength="1.0"
                 startOffset="0.0"
                 stopOffset="0.0" >
            <cornerReference id="2"/>
            <cornerReference id="3"/>
        </marking>
    </markings>
    <parkingSpace access="all">
    </parkingSpace>
</object>
```

```
<object type="parkingSpace"
        subtype="closed"
        name="parkingGarage"
        id="10"
        s="3.0e+01"
        t="-6.0"
        zOffset="0.0"
        length="6.0"
        width="3.45"
        height="2.64"
        hdg="0.0"
        roll="0.0"
        pitch="0.0"
        orientation="+">
    <outlines>
        <outline id="53" fillType="concrete" outer="false">
            <cornerLocal v="-3.0" u="-1.43" z="0.0" height="2.11" id="0">
            <cornerLocal v="-3.0" u="1.43" z="0.0" height="2.11" id="1">
            <cornerLocal v="2.705" u="1.43" z="0.0" height="2.11" id="2">
            <cornerLocal v="2.705" u="-1.43" z="0.0" height="2.11" id="3">
        </outline>
    </outlines>
    <parkingSpace access="residents">
    </parkingSpace>
</object>
```

<a id="_pole"></a>
### 13.14.7 pole

A pole is thin long object beside drivable lanes.

<a id="tab-f1903a27-ddcd-4b15-8479-8fda610ed16f"></a>
Table 114. Combinations of attributes and elements for <object type="pole">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<skeleton>` | `<border>` `<parkingSpace>` `<material>` `<marking>` `<surface>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pole | emergencyCallBox |  | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| pole | permanentDelineator |  | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| pole | bollard |  | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| pole | trafficSign | pole for Traffic Signs | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| pole | trafficLight | pole for trafficLight and trafficSign objects | either or |  | not allowed | optional | optional, default value for @closed="true" | recommended if it has an extrusion. Use `<polyline>`, of which first vertex has an @intersectionPoint. | not allowed |
| pole | powerPole | has power cables attached | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| pole | streetLamp | has a light source. Might also have trafficSigns or trafficLights attached to it. | either or |  | not allowed | optional | optional, default value for @closed="true" | recommended if it has an arm. Use `<polyline>`, of which first vertex has an @intersectionPoint. | not allowed |
| pole | windTurbine |  | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| pole | other | all other pole objects subtypes that do not fit into current categories | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |

**XML example**

```
<object type="pole"
        subtype="emergencyCallBox"
        name="emergencyCallBoxGerman"
        id="4"
        s="1.1350690873e+02"
        t="-5.4331497312e+00"
        zOffset="0.000"
        validLength="0.0"
        hdg="0.000"
        orientation="none"
        height="1.800"
        radius="0.05"
        roll="0"
        pitch="0"
        dynamic="no">
</object>
```

<a id="_roadmark"></a>
### 13.14.8 roadMark

A roadMark object is painted on the road and can be passed.

<a id="tab-dd943fe3-32ff-46ee-b9bf-921ca134fc81"></a>
Table 115. Combinations of attributes and elements for <object type="roadMark">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<marking>` `<material>` `<surface>` | `<skeleton>` `<border>` `<parkingSpace>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| roadMark | arrowLeft |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowLeftLeft |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowLeftRight |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowRight |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowRightRight |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowRightLeft |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowStraight |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowStraightLeft |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowStraightRight |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowStraightLeftRight |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowMergeLeft |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | arrowMergeRight |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | signalLines | these are referenced by a signal | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | text | for example, YIELD or 50, might be referenced by a signal | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | symbol | for example, Wheelchair or bicycle | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | paint |  | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | area | for example, restricted area, keep clear area | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadMark | other | all other roadMark objects subtypes that do not fit into current categories | not allowed | mandatory | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |

**XML example**

```
<object type="roadMark"
        subtype="arrowStraight"
        name="arrowStraightWhite"
        id="5"
        s="1.5856415945e+00"
        t="1.7853615772e+00"
        zOffset="0.000"
        orientation="none"
        hdg="0.000"
        length="7.373"
        width="0.552"
        roll="0"
        pitch="0"
        validLength="0"
        height="0"
        dynamic="no">
    <outline id="1" outer="true" closed="true" laneType="driving">
        <cornerLocal u="-3.6386" v="0.1123" z="0.0000" height="0.0000" id="0"/>
        <cornerLocal u="-3.6864" v="-0.1213" z="0.0000" height="0.0000" id="1"/>
        <cornerLocal u="0.8244" v="-0.0792" z="0.0000" height="0.0000" id="2"/>
        <cornerLocal u="0.8167" v="-0.2762" z="0.0000" height="0.0000" id="3"/>
        <cornerLocal u="3.6864" v="-0.0093" z="0.0000" height="0.0000" id="4"/>
        <cornerLocal u="0.8104" v="0.2762" z="0.0000" height="0.0000" id="5"/>
        <cornerLocal u="0.7872" v="0.0582" z="0.0000" height="0.0000" id="6"/>
        <cornerLocal u="-3.6386" v="0.1123" z="0.0000" height="0.0000" id="7"/>
    </outline>
    <material roadMarkColor="white"/>
    <validity fromLane="1" toLane="1"/>
</object>
```

<a id="_roadsurface"></a>
### 13.14.9 roadSurface

A roadSurface object is on the road and can be passed.

<a id="tab-2d79de42-7392-42f5-8090-72f289aa3ce7"></a>
Table 116. Combinations of attributes and elements for <object type="roadSurface">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<material>` `<surface>` | `<skeleton>` `<border>` `<parkingSpace>` `<marking>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| roadSurface | manhole | mostly metal cover to access sewerage tunnels | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadSurface | pothole | road damage | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadSurface | patch | road damage that has been fixed | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadSurface | speedbump | mostly raised surface to prevent higher speeds | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadSurface | drainGutter | water drainage | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |
| roadSurface | other | all other roadSurface objects subtypes that do not fit into current categories | either or |  | not allowed | optional | optional, default value for @closed="true" | optional | not allowed |

**XML example**

```
<object type="roadSurfaceElement"
        subType="patch"
        name="Rd_Damage_Patch_22_CRG"
        id="2"
        s="3.1064163564293011e+01"
        t="1.6886219784199805e+00"
        zOffset="0.0000000000000000e+00"
        validLength="0.0000000000000000e+00"
        orientation="none"
        length="1.9179999999999999e+00"
        width="3.2229999999999999e+00"
        height="0.0000000000000000e+00"
        hdg="5.7401170550235827e+00"
        pitch="0.0000000000000000e+00"
        roll="0.0000000000000000e+00">
    <surface>
        <CRG file="Rd_Damage_Patch_22_Center.crg" hideRoadSurfaceCRG="true" zScale="1"/>
    </surface>
</object>
```

<a id="_trafficisland"></a>
### 13.14.10 trafficIsland

A trafficIsland object is on the road and should not be passed by vehicles.

<a id="tab-bd9e7bc2-669e-4685-8663-043acb522688"></a>
Table 117. Combinations of attributes and elements for <object type="trafficIsland">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<material>` `<border>` `<marking>` | `<skeleton>` `<surface>` `<parkingSpace>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| trafficIsland | island | typical traffic island with some curbstone, road mark | either or |  | not allowed | not recommended | recommended, default value for @closed="true" | optional | not allowed |
| trafficIsland | other | all other trafficIsland objects subtypes that do not fit into current categories | either or |  | not allowed | not recommended | recommended, default value for @closed="true" | optional | not allowed |

**XML example**

```
<object type="trafficIsland"
        subtype="island"
        name="ExampleIsland"
        id="8"
        s="5.0000000000000441e+01"
        t="4.4053649617126212e-13"
        zOffset="0.0000000000000000e+00"
        orientation="none"
        length="5.0000000000000000e+00"
        width="1.0000000000000000e+00"
        height="1.0000000000000000e-01"
        hdg="0.0000000000000000e+00"
        pitch="0.0000000000000000e+00"
        roll="0.0000000000000000e+00">
    <outlines>
        <outline id="50" fillType="cobble" closed="true">
            <cornerRoad s="52.5" t="1.5" dz="0.0" height="0.1"/>
            <cornerRoad s="52.6" t="1.1" dz="0.0" height="0.1"/>
            <cornerRoad s="52.7" t="0.7" dz="0.0" height="0.1"/>
            <cornerRoad s="52.8" t="0.6" dz="0.0" height="0.1"/>
            <cornerRoad s="52.9" t="0.55" dz="0.0" height="0.1"/>
            <cornerRoad s="53.0" t="0.5" dz="0.0" height="0.1"/>
            <cornerRoad s="57.0" t="0.5" dz="0.0" height="0.1"/>
            <cornerRoad s="57.5" t="0.5" dz="0.0" height="0.01"/>
            <cornerRoad s="61.5" t="0.5" dz="0.0" height="0.01"/>
            <cornerRoad s="62.0" t="0.5" dz="0.0" height="0.1"/>
            <cornerRoad s="66.0" t="0.5" dz="0.0" height="0.1"/>
            <cornerRoad s="66.1" t="0.55" dz="0.0" height="0.1"/>
            <cornerRoad s="66.2" t="0.6" dz="0.0" height="0.1"/>
            <cornerRoad s="66.3" t="0.7" dz="0.0" height="0.1"/>
            <cornerRoad s="66.4" t="1.1" dz="0.0" height="0.1"/>
            <cornerRoad s="66.5" t="1.5" dz="0.0" height="0.1"/>
            <cornerRoad s="66.4" t="1.9" dz="0.0" height="0.1"/>
            <cornerRoad s="66.3" t="2.3" dz="0.0" height="0.1"/>
            <cornerRoad s="66.2" t="2.4" dz="0.0" height="0.1"/>
            <cornerRoad s="66.1" t="2.45" dz="0.0" height="0.1"/>
            <cornerRoad s="66.0" t="2.5" dz="0.0" height="0.1"/>
            <cornerRoad s="62.0" t="2.5" dz="0.0" height="0.1"/>
            <cornerRoad s="61.5" t="2.5" dz="0.0" height="0.01"/>
            <cornerRoad s="57.5" t="2.5" dz="0.0" height="0.01"/>
            <cornerRoad s="57.0" t="2.5" dz="0.0" height="0.1"/>
            <cornerRoad s="53.0" t="2.5" dz="0.0" height="0.1"/>
            <cornerRoad s="52.9" t="2.45" dz="0.0" height="0.1"/>
            <cornerRoad s="52.8" t="2.4" dz="0.0" height="0.1"/>
            <cornerRoad s="52.7" t="2.3" dz="0.0" height="0.1"/>
            <cornerRoad s="52.6" t="1.9" dz="0.0" height="0.1"/>
        </outline>
    </outlines>
    <borders>
        <border width="0.1" type="curb" outlineId="50" useCompleteOutline="true"/>
    </borders>
</object>
```

<a id="_tree"></a>
### 13.14.11 tree

A tree object is a single vegetational object with a trunk.

<a id="tab-3a631c73-39fa-4cef-a2cb-eddc7e7b993d"></a>
Table 118. Combinations of attributes and elements for <object type="tree">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<skeleton>` | `<material>` `<surface>` `<border>` `<parkingSpace>` `<marking>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| tree | needle | needle tree | either or |  | not allowed | optional | recommended, 2 entries, one for trunk, one for crown |  | not allowed |
| tree | leaf | leaf tree | either or |  | not allowed | optional | recommended, 2 entries, one for trunk, one for crown |  | not allowed |
| tree | palm | palm tree | either or |  | not allowed | optional | recommended, 2 entries, one for trunk, one for crown |  | not allowed |
| tree | other | all other tree objects subtypes that do not fit into current categories | either or |  | not allowed | optional | recommended, 2 entries, one for trunk, one for crown |  | not allowed |

**XML example**

```
<object type="tree"
        subtype="leaf"
        name="leafTree"
        id="6"
        s="9.3817187499999548e+01"
        t="-5.001023698365620e+00"
        zOffset="-1.00"
        roll="0"
        pitch="0"
        validLength=""
        orientation="none"
        height="7.50"
        length="4.00"
        width="4.00"
        dynamic="no"
        hdg="0">
    <skeleton>
        <polyline id="1">
            <vertexLocal u="-0.2" v="1.0" z="1.120" radius="0.15" id="0" intersectionPoint="true" />
            <vertexLocal u="-0.2" v="1.0" z="4.500" radius="0.12" id="1"/>
        </polyline>
    </skeleton>
    <outlines>
        <outline id="2" closed="true">
            <cornerLocal u="2.0" v="0.0" z="4.0" height="3.5" id="0"/>
            <cornerLocal u="1.0" v="2.0" z="4.0" height="3.5" id="1"/>
            <cornerLocal u="-1.0" v="2.0" z="4.0" height="3.5" id="2"/>
            <cornerLocal u="-2.0" v="0.0" z="4.0" height="3.5" id="3"/>
            <cornerLocal u="-1.0" v="-2.0" z="4.0" height="3.5" id="4"/>
            <cornerLocal u="-1.0" v="-2.0" z="4.0" height="3.5" id="5"/>
        <outline>
    </outlines>
</object>
```

<a id="_vegetation"></a>
### 13.14.12 vegetation

A vegetation object is a single vegetational object without a trunk or an area of vegetation.

<a id="tab-6ac38a23-3657-4147-8764-c1ba6f880626"></a>
Table 119. Combinations of attributes and elements for <object type="vegetation">

| @type | @subType | Description | Boundingbox using @radius and @height | Boundingbox using @width, @length and @height | `<repeat>` with @distance="0" | `<repeat>` with @distance>"0" | `<outlines>` | `<skeleton>` `<material>` `<surface>` `<border>` `<parkingSpace>` `<marking>` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vegetation | bush | a single bush | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| vegetation | forest | an area that is a forest | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| vegetation | hedge | a single hedge | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |
| vegetation | other | all other vegetation objects subtypes that do not fit into current categories | either or |  | not allowed | optional | optional, default value for @closed="true" | not allowed |

**XML example**

```
<object type="vegetation"
        subType="bush"
        name="VegBush06"
        id="3"
        s="5.5223437499999534e+01"
        t="1.1123800966684282e+01"
        zOffset="-1.6500000000000004e-01"
        validLength="0.0000000000000000e+00"
        orientation="none"
        radius="1.5409999999999998e+00"
        height="3.1600000000000001e+00"
        hdg="0.0000000000000000e+00"
        pitch="0.0000000000000000e+00"
        roll="0.0000000000000000e+00">
</object>
```
