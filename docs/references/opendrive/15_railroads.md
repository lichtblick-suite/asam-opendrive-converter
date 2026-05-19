> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 15 Railroads

## 15.1 Introduction to railroads

In addition to roads, ASAM OpenDRIVE offers the possibility to model rail-based transport systems, that is, trams, and streetcars. ASAM OpenDRIVE cannot be used for complex railway networks and railway signals. ASAM OpenDRIVE describes rail networks only where roads and railroad tracks meet.

**Elements in UML model**

**`<railroad>` element**

In ASAM OpenDRIVE, railroads are represented by the `<railroad>` element within the `<road>` element.

UML class: t\_road\_railroad
XML tag:   <railroad> (Multiplicity: 0..1)

Container for all railroad definitions that shall be applied along a road.

The available set of railroad elements is currently limited to the definition of switches. All other entries shall be covered with the existing elements, for example, track definition by `<road>`, signal definition by `<signal>`, etc. Railroad-specific elements are defined against the background of streetcar applications.

![img](../_images/uml_class_diagrams/EAID_6B1CED55_51A4_4c21_978B_35F9092CC559.png)

Figure 139. UML class diagram of the Railroad class

[Figure 139](#fig-cb539359-0b87-4ef7-a951-621b77da3bb4) shows the UML class diagram of the ASAM OpenDRIVE Railroad class.

**Rules**

The following rules apply to railroads:

*   Each railroad track requires one road.

**Related topics**

*   [Section 15.2, "Railroad tracks"](15_02_railroad_tracks.html#top-bd13c77a-7b58-416c-9449-7c1dcf43497e)
    
*   [Section 15.3, "Switches"](15_03_switches.html#top-bc2ab6c7-071a-41b5-b183-c9dd80e372f4)
    
*   [Section 15.4, "Stations"](15_04_stations.html#top-049863be-26b9-4c34-9991-ac8ad690c8be)

## 15.2 Railroad tracks

In ASAM OpenDRIVE, railroad tracks are always described in connection with the roads on which one pair of railroad track run. It is not possible to define railroad tracks outside of roads. Railroad tracks always need an own road. They cannot share a road with other traffic elements. Regardless of a tram or sharing the same space with none railway traffic or separate of none railway traffic, it always needs a separate road.

Railroad tracks are defined per lane using the @type attribute. Because rail-based traffic differs from road traffic, the following recommendations apply to the modeling of railroads:

![img](../_images/15_railroads/railroads_1.png)

Figure 140. Road reference lines for roads and railroads

[Figure 140](#fig-b291ed3c-985a-4760-b514-46afde41fe9f) shows the difference between the use of the road reference line for roads and railroads.

In ASAM OpenDRIVE, railroad tracks are represented by the @type attribute within the `<lane>` element. The values for railroad tracks are `tram` and `rail`.

**Rules**

The following rules apply to railroads:

*   [asam.net:xodr:1.7.0:road.railroad.rail\_refline\_centered](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-rail-refline-centered): The road reference line shall be in the center of the pair of railroad tracks.
    
*   [asam.net:xodr:1.7.0:road.railroad.one\_rail\_per\_road](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-one-rail-per-road): There shall only be one tram or one rail lane per road.
    
*   [asam.net:xodr:1.7.0:road.railroad.rail\_lane\_width\_validity](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-rail-lane-width-validity): The width of the lane shall be at least the width rail-bound vehicles.

**Related topics**

*   [Section 15.1, "Introduction to railroads"](15_01_introduction.html#top-cc907730-d1cf-4775-8d97-1898f533257b)
    
*   [Section 15.3, "Switches"](15_03_switches.html#top-bc2ab6c7-071a-41b5-b183-c9dd80e372f4)

## 15.3 Switches

Rail-bound vehicles use switches to change their tracks. In contrast to junctions, a switch can guide the vehicles into two directions only.

There are two different types of switches:

*   Dynamic switches split the railroad track into two tracks leading in two directions. Dynamic switches can be changed during the simulation.
    
*   Static switches split the railroad track into two tracks leading in two directions and have the two variants `straight` and `turn`. Static switches cannot be changed during the simulation.

Switches may be placed at an arbitrary position on a main track.

![img](../_images/15_railroads/railroads_2.png)

Figure 141. Railroad switches

[Figure 141](#fig-a2f03594-1b25-42ac-9afc-589bbc0fba12) shows the two partner switches `12` and `32`. A side track `2` connects the two main tracks `1` and `3`.

**Elements in UML model**

**`<switch>` element**

In ASAM OpenDRIVE, switches are represented by the `<switch>` element within the `<railroad>` element.

UML class: t\_road\_railroad\_switch
XML tag:   <switch> (Multiplicity: 0..\*)

Switches change the tracks for rail-bound vehicles. Switches guide the vehicles into two directions only.

Table 142. Attributes of the <switch> element

Name

Type

Use

Description

`id`

string

required

Unique ID of the switch; preferably an integer number, see uint32\_t

`name`

string

required

Unique name of the switch

`position`

[e\_road\_railroad\_switch\_position](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_7B38FC66_AE1D_46eb_977F_06C8C68493CD)

required

Either a switch can be operated (dynamic) or it is in a static position

**XML example**

```
<railroad>
    <switch name="ExampleSwitch12" id="12" position="dynamic">
        <mainTrack id="1" s="1.0000000000000000e+01" dir="+"/>
        <sideTrack id="2" s="0.0000000000000000e+00" dir="+"/>
        <partner name="ExampleSwitch32" id="32"/>
    </switch>
</railroad>
```

**Rules**

The following rules apply to switches:

*   A switch may be either dynamic or static.

**Related topics**

*   [Section 15.2, "Railroad tracks"](15_02_railroad_tracks.html#top-bd13c77a-7b58-416c-9449-7c1dcf43497e)
    
*   [Section 15.3.1, “Main track”](#sec-c2acd458-27c6-48bf-983b-6c91a9feb1bd)
    
*   [Section 15.3.2, “Side track”](#sec-3c7e5de0-490c-4148-9ef1-10cbc2fd7516)
    
*   [Section 15.3.3, “Partner switches”](#sec-22a79a45-79b1-4f2b-aba9-4fa65211bf21)

### 15.3.1 Main track

A main track represents the main course for rail bound traffic. A main track has the same properties as a side track. The two track types have been implemented as a convenience function to simplify the modeling of tracks entering and coming out of switches. [Figure 141](#fig-a2f03594-1b25-42ac-9afc-589bbc0fba12) shows a main track.

**Elements in UML model**

**`<mainTrack>` element**

In ASAM OpenDRIVE, main tracks are represented by the `<mainTrack>` element within the `<switch>` element.

UML class: t\_road\_railroad\_switch\_mainTrack
XML tag:   <mainTrack>

Main tracks form the primary course for rail bound traffic.

Table 143. Attributes of the <mainTrack> element

Name

Type

Use

Unit

Description

`dir`

[e\_elementDir](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D1E21B53_3817_4627_8EC7_24415D264892)

required

direction, relative to the s-direction, on the main track for entering the side track via the switch

`id`

string

required

Unique ID of the main track, that is, the `<road>` element. Must be consistent with parent containing this `<railroad>` element.

`s`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of the switch, that is, the point where main track and side track meet

**Rules**

The following rules apply to main tracks:

*   [asam.net:xodr:1.7.0:road.railroad.switch.check\_switch\_conn](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-switch-check-switch-conn): Main tracks shall not be used to connect two switches.

**Related topics**

*   [Section 15.3.2, “Side track”](#sec-3c7e5de0-490c-4148-9ef1-10cbc2fd7516)
    
*   [Section 15.3.3, “Partner switches”](#sec-22a79a45-79b1-4f2b-aba9-4fa65211bf21)

### 15.3.2 Side track

A side track connects two switches that are placed on main tracks. A side track has the same properties as a main track. The two track types have been implemented as convenience function to simplify the modeling of tracks entering and coming out of switches.

[Figure 141](#fig-a2f03594-1b25-42ac-9afc-589bbc0fba12) shows a side track.

**Elements in UML model**

**`<sideTrack>` element**

In ASAM OpenDRIVE, side tracks are represented by the `<sideTrack>` element within the `<switch>` element.

UML class: t\_road\_railroad\_switch\_sideTrack
XML tag:   <sideTrack>

Side tracks connect two switches that are placed on main tracks.

Table 144. Attributes of the <sideTrack> element

Name

Type

Use

Unit

Description

`dir`

[e\_elementDir](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D1E21B53_3817_4627_8EC7_24415D264892)

required

direction, relative to the s-direction, on the side track for after entering it via the switch

`id`

string

required

Unique ID of the side track, that is, the `<road>` element

`s`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of the switch on the side track

**Rules**

The following rules apply to side tracks:

*   Side tracks shall be used to link two switches only.

**Related topics**

*   [Section 15.3.1, “Main track”](#sec-c2acd458-27c6-48bf-983b-6c91a9feb1bd)
    
*   [Section 15.3.3, “Partner switches”](#sec-22a79a45-79b1-4f2b-aba9-4fa65211bf21)

### 15.3.3 Partner switches

For convenience reasons, two switches may be declared partner switches. This describes a connection between two switches that are linked by a side track. These two switches need to be set consistently. [Figure 141](#fig-a2f03594-1b25-42ac-9afc-589bbc0fba12) shows the partner switches `12` and `32`.

**Elements in UML model**

**`<partner>` element**

In ASAM OpenDRIVE, partner switches are represented by the `<partner>` element within the `<switch>` element.

UML class: t\_road\_railroad\_switch\_partner
XML tag:   <partner> (Multiplicity: 0..1)

Partner switches are two consistently set switches linked by a side track.

Table 145. Attributes of the <partner> element

Name

Type

Use

Description

`id`

string

required

Unique ID of the partner switch

`name`

string

optional

Unique name of the partner switch

**Rules**

The following rules apply to partner switches:

*   Partner switches shall be used to indicate that a side track links two switches.
    
*   [asam.net:xodr:1.7.0:road.railroad.switch.single\_switch\_no\_partner](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-switch-single-switch-no-partner): Single switches do not have partner switches.

**Related topics**

*   [Section 15.3.1, “Main track”](#sec-c2acd458-27c6-48bf-983b-6c91a9feb1bd)
    
*   [Section 15.3.2, “Side track”](#sec-3c7e5de0-490c-4148-9ef1-10cbc2fd7516)

## 15.4 Stations

Rail-bound vehicles like trams need stations for people to get on and off. Each station shall have at least one platform, which may be further divided into segments. The platforms determine the physical extent of a station.

The `<station>` element may also be used for bus stations.

![img](../_images/15_railroads/railroads_3.png)

Figure 142. Railroad stations

[Figure 142](#fig-a1c9fc52-e344-4dad-8624-4dd99fdb5233) shows two scenarios for stations:

*   In the first scenario, one platform is referenced by the roads `1` and `3`, running in different driving directions. The platform consists of one segment only.
    
*   In the second scenario, platform `1` is referenced by road `5` only. Platform `2` is referenced by road `4` and `6`. Platform `2` is split into two segments.

**Elements in UML model**

**`<station>` element**

In ASAM OpenDRIVE, stations are represented by the `<station>` element within the `<OpenDRIVE>` element.

UML class: t\_station
XML tag:   <station> (Multiplicity: 0..\*)

Stations are places on the rail network where passengers enter and leave rail-bound vehicles at platforms.

May refer to multiple tracks and is therefore defined on the same level as junctions.

Table 146. Attributes of the <station> element

Name

Type

Use

Description

`id`

string

required

Unique ID within database

`name`

string

required

Unique name of the station

`type`

[e\_station\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_45C714B7_9D7E_4e51_9516_36C51903358C)

optional

Type of station. Free text, depending on the application.
e.g.: small, medium, large

![img](../_images/uml_class_diagrams/EAID_2C45CCE7_B666_43dd_B239_6E71586B04E1.png)

Figure 143. UML class diagram of the Station class

[Figure 143](#fig-cab6a3b8-a90a-4743-83f5-e6820f19ac01) shows the UML class diagram of the ASAM OpenDRIVE Station class.

**XML example**

*   [Ex\_Railway-Station.xodr](../_attachments/examples/Ex_Railway-Station/Ex_Railway-Station.xodr)

**Rules**

The following rules apply to stations:

*   [asam.net:xodr:1.7.0:road.railroad.stations.one\_platform\_per\_station](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-stations-one-platform-per-station): A `<station>` element shall be followed by at least one `<platform>` element.
    
*   The type of the station may be further specialized by the @type attribute. The values are stored in the used application.

**Related topics**

*   [Section 15.1, "Introduction to railroads"](15_01_introduction.html#top-cc907730-d1cf-4775-8d97-1898f533257b)
    
*   [Section 15.4.1, “Platforms”](#sec-9504c509-63ef-427a-a9b9-db307266e523)
    
*   [Section 15.4.2, “Segments”](#sec-279fe10d-a645-4073-8950-02f81f8183f6)

### 15.4.1 Platforms

A station shall contain at least one platform. A platform shall be referenced by one or more railroad tracks. See picture in [Figure 142](#fig-a1c9fc52-e344-4dad-8624-4dd99fdb5233).

**Elements in UML model**

**`<platform>` element**

In ASAM OpenDRIVE, platforms are represented by the `<platform>` element within the `<station>` element.

UML class: t\_station\_platform
XML tag:   <platform> (Multiplicity: 1..\*)

Platforms are essential parts of stations for passengers to enter and leave rail-bound vehicles. One or more railroad tracks reference one platform.

Table 147. Attributes of the <platform> element

Name

Type

Use

Description

`id`

string

required

Unique ID within database

`name`

string

optional

Name of the platform. May be chosen freely.

**Rules**

The following rules apply to platforms:

*   [asam.net:xodr:1.7.0:road.railroad.platforms.min\_amount](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-platforms-min-amount): There shall be at least one platform per station.
    
*   [asam.net:xodr:1.7.0:road.railroad.platforms.min\_segments](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-platforms-min-segments): A platform shall contain at least one segment.

**Related topics**

*   [Section 15.4.2, “Segments”](#sec-279fe10d-a645-4073-8950-02f81f8183f6)

### 15.4.2 Segments

Platforms may be further divided into segments. This is useful if a bi-directional railroad track runs along the same platform. A platform shall contain at least one segment.

**Elements in UML model**

**`<segment>` element**

In ASAM OpenDRIVE, segments are represented by the `<segment>` element within the `<platform>` element.

UML class: t\_station\_platform\_segment
XML tag:   <segment> (Multiplicity: 1..\*)

Segments are parts of platforms.

Each `<platform>` element is valid on one or more track segments. The `<segment>` element must be specified.

Table 148. Attributes of the <segment> element

Name

Type

Use

Unit

Description

`roadId`

string

required

Unique ID of the `<road>` element (track) that accompanies the platform

`sEnd`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

Maximum s-coordiante on `<road>` element that has an adjacent platform

`sStart`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

Minimum s-coordinate on `<road>` element that has an adjacent platform

`side`

[e\_station\_platform\_segment\_side](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EA21D184_0B60_44d3_8288_0B9F483F72E9)

required

Side of track on which the platform is situated when going from sStart to sEnd

**Rules**

The following rules apply to segments:

*   [asam.net:xodr:1.7.0:road.railroad.segment.segmenta\_per\_platform\_min\_amount](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-railroad-segment-segmenta-per-platform-min-amount): There shall be at least one segment per platform.

**Related topics**

*   [Section 15.4.1, “Platforms”](#sec-9504c509-63ef-427a-a9b9-db307266e523)
