> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 12 Junctions

## 12.1 Introduction to junctions

Junctions enable the connection of more than two roads.

Four types of junctions exist:

* Common junctions are junctions with drivable lanes that can overlap and where traffic can cross.
* Direct junctions are junctions where traffic can change roads but cannot cross other traffic.
* Virtual junctions are junctions where the main road is not interrupted.
* Crossings are junctions where traffic cannot change the roads.

<a id="tab-1af4e389-752c-4cd3-9702-8763eb20850a"></a>
Table 54. Usage of the different types of junctions

| Use case | Overlapping lanes | Crossing traffic | Changing roads | Junction type | Alternative junction type |
| --- | --- | --- | --- | --- | --- |
| ordinary junctions | yes | yes | yes | common | n/a |
| junctions with traffic lights | yes | yes | yes | common | n/a |
| entries and exits | no | no | yes | direct | common (not recommended) |
| entries and exits | yes | no | yes | if constant elevation: direct, otherwise: common | common |
| entries and exits | yes | yes | yes | common | n/a (direct not possible) |
| driveways to parking lots | yes | yes | yes | if constant elevation: virtual, otherwise: common | common |
| driveways to residential estates | yes | yes | yes | if constant elevation: virtual, otherwise: common | common |
| slip lanes | no | no | yes | combination of one common and many direct | common |
| slip lanes | yes | no | yes | if constant elevation: combination of one common and many direct, otherwise: many common | common |
| railway crossing | yes | yes | no | crossing | common |

<a id="fig-8b7e2624-7c2f-4771-9e00-284dc2067532"></a>
![img](../_images/uml_class_diagrams/EAID_522853C6_A091_462c_9784_E01118BD53AB.png)

Figure 82. UML class diagram of the Junction class

[Figure 82](#fig-8b7e2624-7c2f-4771-9e00-284dc2067532) shows the UML class diagram of the ASAM OpenDRIVE Junction class.

**Rules**

The following rules apply to junctions:

* [asam.net:xodr:1.4.0:junctions.no\_overlap](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-junctions-no-overlap): No junctions of any type shall overlap each other.

* [asam.net:xodr:1.7.0:junctions.type\_direct\_no\_conn\_road](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-type-direct-no-conn-road): The `<connection>` element of a junction of @type="direct" shall not have the @connectingRoad attribute.

* [asam.net:xodr:1.7.0:junctions.type\_default\_no\_linked\_road](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-type-default-no-linked-road): The `<connection>` element of a junction of @type="default" or @type="virtual" shall not have the @linkedRoad attribute.

## 12.2 Common junctions

Common junctions are junctions with drivable lanes that can overlap.

<a id="fig-eac389f6-e0bc-4dcc-acf5-04ebf90e7f21"></a>
![img](../_images/12_junctions/junction_1.png)

Figure 83. Types of roads in a junction (right-hand traffic)

[Figure 83](#fig-eac389f6-e0bc-4dcc-acf5-04ebf90e7f21) shows two different kinds of roads with relation to junctions.

* Incoming roads: These roads contain lanes that lead into a junction.
* Connecting roads: These roads represent the paths through a junction.

Outgoing roads are not specifically defined as an element or attribute in ASAM OpenDRIVE.
Incoming roads serve as outgoing roads.
These roads are implicitly defined as outgoing by the connecting roads that lead into them.

**Elements in UML model**

For elements in the UML model see [Figure 82](12_01_introduction.html#fig-8b7e2624-7c2f-4771-9e00-284dc2067532).

**`<junction>` element**

In ASAM OpenDRIVE, junctions are represented by `<junction>` elements within the `<OpenDRIVE>` element.

```
UML class: t_junction_common
XML tag:   <junction type="default"> (Multiplicity: 0..*)
```

Common junctions are the default type of junction in ASAM OpenDRIVE and specify areas where drivable lanes may overlap and traffic may cross.

<a id="tab-EAID_FC7CDA3D_EF02_47d0_BE91_AAE999442C14"></a>
Table 55. Attributes of the <junction type="default"> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `id` | string | required | ID of the junction to which the road belongs, for example connecting roads, cross paths, and roads of a junction boundary. Use -1 for none. |
| `name` | string | optional | Name of the junction. May be chosen freely. |
| `type` | [e\_junction\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_40D9549F_DB59_4440_A889_A09659446ED6) | optional | Common junctions are of type "default". If the attribute is not specified, the junction type is "default". This attribute is mandatory for all other junction types. |

**`<connection>` element**

In ASAM OpenDRIVE, connections in a junction are represented by `<connection>` elements within the `<junction>` element.

```
UML class: t_junction_connection_common
XML tag:   <connection> (Multiplicity: 0..*)
```

Provides information about a single connection within a common junction.

<a id="tab-EAID_2832B996_30BA_4cfc_A8AF_C9A03738DFC5"></a>
Table 56. Attributes of the <connection> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `connectingRoad` | string | required | ID of the connecting road. Only to be used for junctions of @type="default". |
| `contactPoint` | [e\_contactPoint](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EF13C2F5_5229_46f8_983F_E8B6252DC5B7) | optional | Contact point on the @connectingRoad or @linkedRoad. Required for all junction types except virtual. |
| `id` | string | required | Unique ID within the junction |
| `incomingRoad` | string | optional | ID of the incoming road. Required for all junction types except virtual. |

**Rules**

The following rules apply to common junctions:

* [asam.net:xodr:1.4.0:junctions.common.when\_to\_use](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-junctions-common-when-to-use): Junctions shall only be used when roads cannot be linked directly. They clarify ambiguities for the linking. Ambiguities are caused when a road has two or more possible predecessor or successor roads.

* [asam.net:xodr:1.4.0:junctions.common.junctions\_no\_pred\_succ](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-junctions-common-junctions-no-pred-succ): Unlike roads, junctions do not have a predecessor or successor.

* A junction may have an own name to distinguish it from other junctions.
* Junctions should not be used when only two roads meet.

* [asam.net:xodr:1.5.0:junctions.common.virtual\_junction\_attributes](../16_annexes/map_rules.html#asam-net-xodr-1-5-0-junctions-common-virtual-junction-attributes): The @mainRoad, @orientation, @sStart and @sEnd attributes shall only be specified for virtual junctions.

* [asam.net:xodr:1.8.0:junctions.common.direct\_junction\_attributes](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-common-direct-junction-attributes): The @overlapZone attribute shall only be specified for direct junctions.

**Related topics**

* [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
* [Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)
* [Section 12.3, "Incoming roads"](12_03_incoming_roads.html#top-c0d5f9a9-a73a-4bcc-9a8c-393f357a559c)
* [Section 12.4, "Connecting roads"](12_04_connecting_roads.html#top-3e9bb97e-f2ab-4751-906a-c25e9fb7ac4e)

## 12.3 Incoming roads

Incoming roads contain lanes that lead into a junction.
Because outgoing roads are not specifically defined in ASAM OpenDRIVE, incoming roads may also serve as outgoing roads, see [Figure 83](12_02_common_junctions.html#fig-eac389f6-e0bc-4dcc-acf5-04ebf90e7f21).

To specify a road as incoming road, its ID is referenced in the `<connection>` element using the @incomingRoad attribute.

**Elements in UML model**

**`<connection incomingRoad="…​">` element**

In ASAM OpenDRIVE, incoming roads are represented by the @incomingRoad attribute of `<connection>` elements within the `<junction>` element.

```
UML class: t_junction_connection_common
XML tag:   <connection> (Multiplicity: 0..*)
```

Provides information about a single connection within a common junction.

<a id="tab-EAID_2832B996_30BA_4cfc_A8AF_C9A03738DFC5"></a>
Table 57. Attributes of the <connection> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `connectingRoad` | string | required | ID of the connecting road. Only to be used for junctions of @type="default". |
| `contactPoint` | [e\_contactPoint](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EF13C2F5_5229_46f8_983F_E8B6252DC5B7) | optional | Contact point on the @connectingRoad or @linkedRoad. Required for all junction types except virtual. |
| `id` | string | required | Unique ID within the junction |
| `incomingRoad` | string | optional | ID of the incoming road. Required for all junction types except virtual. |

**XML example**

```
<junction name="myJunction" id="555" >
    <connection id="0"
                incomingRoad="1"
                connectingRoad="2"
                contactPoint="start">
        <laneLink from="-2" to="-1"/>
    </connection>
</junction>
```

**Rules**

The following rules apply to incoming roads:

* [asam.net:xodr:1.4.0:junctions.connection.connect\_road\_no\_incoming\_road](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-junctions-connection-connect-road-no-incoming-road): Connecting roads shall not be incoming roads.

**Related topics**

* [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
* [Section 12.1, "Introduction to junctions"](12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)
* [Section 12.4, "Connecting roads"](12_04_connecting_roads.html#top-3e9bb97e-f2ab-4751-906a-c25e9fb7ac4e)

## 12.4 Connecting roads

Connecting roads link the roads that meet in a junction.
They describe the paths that a vehicle can travel across a junction.
Connecting roads are modeled in the same way as standard roads.

The paths described by a connecting road is based on its lanes.
The connecting road specifies the connections between the lanes of an incoming road and the lanes of an outgoing road of the same junction.
If the lanes of an incoming and outgoing road are not linked, this means that there is no traversable path between these lanes.

<a id="fig-32710c64-58e4-4133-b300-7be76f475326"></a>
![img](../_images/12_junctions/junction_2.png)

Figure 84. Connecting roads of junction with id 1 (left hand traffic)

[Figure 83](12_02_common_junctions.html#fig-eac389f6-e0bc-4dcc-acf5-04ebf90e7f21) and [Figure 84](#fig-32710c64-58e4-4133-b300-7be76f475326) show the connecting roads inside the junction area that connect the incoming and outgoing roads.

|  | The example in [Table 58](#tab-1f8ca32d-cf77-46db-bd6f-ee9ecb026e42), [Table 59](#tab-5f69947c-02c1-477c-94ab-60bcb734470f), and [Table 60](#tab-729a1f45-253e-40a0-9271-d512ae037c33) only considers how to cross the junction from the road with id="4". |
| --- | --- |
|  |  |

<a id="tab-1f8ca32d-cf77-46db-bd6f-ee9ecb026e42"></a>
Table 58. Junction with id 1

| Connection id | Incoming road | Connecting road | Contact point | Lane link from | Lane link to |
| --- | --- | --- | --- | --- | --- |
| 9 | 4 | 28 | start |  |  |
|  |  |  |  | -3 | 1 |
| 10 | 4 | 61 | start |  |  |
|  |  |  |  | -2 | 1 |
|  |  |  |  | -3 | 2 |
| 11 | 4 | 64 | start |  |  |
|  |  |  |  | -1 | 1 |

<a id="tab-5f69947c-02c1-477c-94ab-60bcb734470f"></a>
Table 59. Roads

| Road id | Predecessor | Contact predecessor | Successor | Contact successor | Junction |
| --- | --- | --- | --- | --- | --- |
| 1 | junction with id 1 |  |  |  | -1 |
| 2 | junction with id 1 |  |  |  | -1 |
| 3 |  |  | junction with id 1 |  | -1 |
| 4 | junction with id 1 |  |  |  | -1 |
| 28 | road with id 4 | start | road with id 2 | start | 1 |
| 61 | road with id 4 | start | road with id 3 | end | 1 |
| 64 | road with id 4 | start | road with id 1 | start | 1 |

<a id="tab-729a1f45-253e-40a0-9271-d512ae037c33"></a>
Table 60. Lane links

| Road id | Lane id | Predecessor’s lane id | Successor’s lane id |
| --- | --- | --- | --- |
| 28 | 1 | -3 | 3 |
| 61 | 1 | -2 | -2 |
| 61 | 2 | -3 | -3 |
| 64 | 1 | -1 | 1 |
| 4 | -3 | no lane link |  |
| 4 | -2 | no lane link |  |
| 4 | -1 | no lane link |  |
| 1 | 1 | no lane link |  |
| 3 | -2 |  | no lane link |
| 3 | -3 |  | no lane link |
| 2 | 3 | no lane link |  |

**Elements in UML model**

**`<connection connectingRoad="…​">` element**

In ASAM OpenDRIVE, connecting roads are represented by the @connectingRoad attribute of `<connection>` elements within the `<junction>` element.

```
UML class: t_junction_connection_common
XML tag:   <connection> (Multiplicity: 0..*)
```

Provides information about a single connection within a common junction.

<a id="tab-EAID_2832B996_30BA_4cfc_A8AF_C9A03738DFC5"></a>
Table 61. Attributes of the <connection> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `connectingRoad` | string | required | ID of the connecting road. Only to be used for junctions of @type="default". |
| `contactPoint` | [e\_contactPoint](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EF13C2F5_5229_46f8_983F_E8B6252DC5B7) | optional | Contact point on the @connectingRoad or @linkedRoad. Required for all junction types except virtual. |
| `id` | string | required | Unique ID within the junction |
| `incomingRoad` | string | optional | ID of the incoming road. Required for all junction types except virtual. |

**`<laneLink>` element**

In ASAM OpenDRIVE, lane links are represented by `<laneLink>` elements within the `<connection>` element.

```
UML class: t_junction_connection_laneLink
XML tag:   <laneLink> (Multiplicity: 0..*)
```

Provides information about the lanes that are linked between an incoming road and a connecting road.
It is strongly recommended to provide this element.
It is deprecated to omit the `<laneLink>` element.

<a id="tab-EAID_521D14A2_3AEB_4223_B1CB_4013672507CC"></a>
Table 62. Attributes of the <laneLink> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `from` | integer | required |  |  | ID of the incoming lane |
| `overlapZone` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | optional | m | 1.8.0 | Specifies the length of the area where traffic from both overlapping lanes shares the space. It is defined in s length relative to the position of the junction. Intended for direct junctions only. Default is 100. |
| `to` | integer | required |  |  | ID of the connection lane |

**XML example**

* [Ex\_LHT-Complex-X-Junction.xodr](../_attachments/examples/Ex_LHT-Complex-X-Junction/Ex_LHT-Complex-X-Junction.xodr) (left-hand traffic)
* [UC\_Simple-X-Junction.xodr](../_attachments/use_cases/UC_Simple-X-Junction/UC_Simple-X-Junction.xodr) (right-hand traffic)

**Rules**

The following rules apply to connecting roads:

* [asam.net:xodr:1.8.0:junctions.connection.one\_link\_to\_incoming](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-connection-one-link-to-incoming): Each connecting road shall be associated with at most one `<connection>` element per incoming road. A connecting road shall only have the `<laneLink>` element for that direction.

* A connecting road may have both right and left lanes.
* An incoming road with multiple lanes may be connected to the lanes of the road leading out off the junction in different ways:

* [asam.net:xodr:1.7.0:junctions.connection.no\_lane\_change\_for\_mult\_con\_roads](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-connection-no-lane-change-for-mult-con-roads): By multiple connecting roads, each with one `<laneLink>` element for the connection between two specific lanes. Lane changes within this junction are not possible.

* [asam.net:xodr:1.7.0:junctions.connection.lane\_change\_one\_con\_road](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-connection-lane-change-one-con-road): By one connecting road with multiple `<laneLink>` elements for the connections between the lanes.

* The linked lanes shall fit smoothly as described for roads (see  [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)).
* The @connectingRoad attribute shall not be used for junctions with @type="direct".

**Related topics**

* [Section 12.3, "Incoming roads"](12_03_incoming_roads.html#top-c0d5f9a9-a73a-4bcc-9a8c-393f357a559c)
* [Section 12.1, "Introduction to junctions"](12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)
* [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
* [Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)
* [Section 12.4.1, “Priorities of connecting roads within a junction”](#sec-f60730d7-4192-440e-a6ba-8082288a1115)
* [Section 11.7.1, "Lane access"](../11_lanes/11_07_lane_properties.html#sec-38bbc30a-8f0f-4387-8a87-0ddd34563404)

<a id="sec-f60730d7-4192-440e-a6ba-8082288a1115"></a>
### 12.4.1 Priorities of connecting roads within a junction

The `<priority>` element within the `<junction>` element defines the priority of a road over another road as a pair with the ID of the road with higher priority in the @high attribute and the ID of the road with lower priority in the @low attribute.

**Elements in UML model**

**`<priority>` element**

In ASAM OpenDRIVE, the priority of roads is represented by `<priority>` elements within the `<junction>` element.

```
UML class: t_junction_priority
XML tag:   <priority> (Multiplicity: 0..*)
```

The junction priority record provides information about the priority of one road over another road that are part of this junction.
It is only required if priorities cannot be derived from signs or signals in a junction or on tracks leading to a junction.

<a id="tab-EAID_C7E5874D_90D1_4da7_998D_C4E8934CA907"></a>
Table 63. Attributes of the <priority> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `high` | string | required | ID of the prioritized road |
| `low` | string | required | ID of the road with lower priority |

**Rules**

The following rules apply to priorities of roads within a junction:

* [asam.net:xodr:1.7.0:junctions.priority.no\_signals](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-priority-no-signals): `<priority>` elements should only be used if there are no signals defined.

* [asam.net:xodr:1.8.0:junctions.priority.high\_and\_low\_attr](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-priority-high-and-low-attr): `<priority>` elements shall be defined with a pair of one @high and one @low attribute.

**Related topics**

* [Section 12.1, "Introduction to junctions"](12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)

<a id="_direction_of_connecting_roads"></a>
### 12.4.2 Direction of connecting roads

Connecting roads inside a junction may have different directions.
For ease of use, the road reference line of the connecting roads should be placed in driving direction if the driving direction is unique.

The @contactPoint attribute inside the `<connection>` element is used to specify the direction of a connecting road.

**Rules**

The following rules apply to the direction of connecting roads:

* [asam.net:xodr:1.7.0:junctions.connection.start\_along\_linkage](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-connection-start-along-linkage): The value `start` shall be used to indicate that the connecting road runs along the linkage indicated in the `<laneLink>` element.

* [asam.net:xodr:1.7.0:junctions.connection.end\_opposite\_linkage](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-connection-end-opposite-linkage): The value `end` shall be used to indicate that the connecting road runs along the opposite direction of the linkage indicated in the `<laneLink>` element

**Related topics**

* [Section 10.4, "Road type"](../10_roads/10_04_road_type.html#top-ca0f8ace-54c0-4f4b-8977-0098d74b3e19)

## 12.5 Cross paths

Cross paths are similar to crossings from the driving point of view, adding connections between specific lanes.
Cross paths are part of the junction similar to connecting roads.

<a id="fig-023ef463-f73a-495f-8a66-cddae8ae71ae"></a>
![img](../_images/12_junctions/cross_path_common.png)

Figure 85. Example of a cross path with a pedestrian crossing in a common junction

[Figure 85](#fig-023ef463-f73a-495f-8a66-cddae8ae71ae) shows a part of a common junction where the road with @id="75" as cross path connects the sidewalks of the two connecting roads with @id="45" and @id="46". The @roadAtStart attribute of the `<crossPath>` element defines which road the `<startLaneLink>` element refers to with its s@ attribute. The @roadAtEnd attribute of the `<crossPath>` element defines which road the `<endLaneLink>` element refers to with its s@ attribute.

Cross paths are represented by `<crossPath>` elements within the `<junction>` element.
A `<crossPath>` element defines the crossing road with the value of the @crossingRoad attribute and the roads connected by the cross path with the values of the @roadAtStart and @roadAtEnd attributes.

**Elements in UML model**

**`<crossPath>` element**

In ASAM OpenDRIVE, cross paths are represented by `<crossPath>` elements within the `<junction>` element.

```
UML class:  t_junction_crossPath
XML tag:    <crossPath> (Multiplicity: 0..*)
Introduced: 1.8.0
```

Cross paths are intended for pedestrian crossings and are junctions elements where traffic of a lane can cross other lanes and continue on a different lane of the same or a different road.
The cross path itself is a separate road.

<a id="tab-EAID_2A4A5D5D_8BDE_453a_9569_6A4AF09840AF"></a>
Table 64. Attributes of the <crossPath> element

| Name | Type | Use | Introduced | Description |
| --- | --- | --- | --- | --- |
| `crossingRoad` | string | required | 1.8.0 | ID of road defining the cross path. |
| `id` | string | required | 1.8.0 | Unique ID within the junction |
| `roadAtEnd` | string | required | 1.8.0 | ID of road at end point of the crossing road |
| `roadAtStart` | string | required | 1.8.0 | ID of road at start point of the crossing road |

**`<startLaneLink>` and `<endLaneLink>` elements**

In ASAM OpenDRIVE, lane links of cross paths are represented by `<startLaneLink>` and `<endLaneLink>` elements within the `<crossPath>` element.

```
UML class:  t_junction_crossPath_laneLink
XML tag:    <endLaneLink> (Multiplicity: 1)
XML tag:    <startLaneLink> (Multiplicity: 1)
Introduced: 1.8.0
```

Define the links between the lanes of the `<crossPath>` to the lanes of other roads.

<a id="tab-EAID_4BDEAF98_F9D8_4405_9C35_3C822816DDFB"></a>
Table 65. Attributes of the <endLaneLink> and <startLaneLink> elements

| Name | Type | Use | Introduced | Description |
| --- | --- | --- | --- | --- |
| `from` | integer | required | 1.8.0 | Lane ID of either @roadAtEnd for `<endLaneLink>` or @roadAtStart for `<startLaneLink>` |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | 1.8.0 | s-coordinate of either start or end point in linked road. |
| `to` | integer | required | 1.8.0 | Lane ID of @crossingRoad |

**XML example**

```
<road name="" length="6.8257399999999990e+01" id="4" junction="-1" rule="RHT">
    <link>
        <successor elementType="junction" elementId="10"/>
    </link>
    ...
    <lanes>
        <laneSection s="0.0000000000000000e+00">
            <left>
                <lane id="3" type="walking" level="false">
                    <link/>
                    ...
                </lane>
                <lane id="2" type="curb" level="false">
                    <link/>
                    ...
                </lane>
                <lane id="1" type="driving" level="false">
                    <link/>
                    ...
                </lane>
            </left>
            <center>
                <lane id="0">
                    ...
                </lane>
            </center>
            <right>
                <lane id="-1" type="driving" level="false">
                    <link/>
                    ...
                </lane>
                <lane id="-2" type="curb" level="false">
                    <link/>
                    ...
                </lane>
                <lane id="-3" type="walking" level="false">
                    <link/>
                    ...
                </lane>
            </right>
        </laneSection>
    </lanes>
    ...
</road>
<road name="" length="3.9995576531488346e+01" id="46" junction="10" rule="RHT">
    <link>
        <predecessor elementType="road" elementId="4" contactPoint="end"/>
        <successor elementType="road" elementId="6" contactPoint="end"/>
    </link>
    <lanes>
        <laneSection s="0.0000000000000000e+00">
            <left>
                <lane id="3" type="walking" level="false">
                    <link>
                        <predecessor id="3"/>
                        <successor id="-3"/>
                    </link>
                    ...
                </lane>
                <lane id="2" type="curb" level="false">
                    <link>
                        <predecessor id="2"/>
                        <successor id="-2"/>
                    </link>
                    ...
                </lane>
                <lane id="1" type="driving" level="false">
                    <link>
                        <predecessor id="1"/>
                        <successor id="-1"/>
                    </link>
                    ...
                </lane>
            </left>
            <center>
                <lane id="0">
                    ...
                </lane>
            </center>
            <right>
                <lane id="-1" type="driving" level="false">
                    <link>
                        <predecessor id="-1"/>
                        <successor id="1"/>
                    </link>
                    ...
                </lane>
            </right>
        </laneSection>
    </lanes>
</road>
<road name="" length="2.8900504898771064e+01" id="45" junction="10" rule="RHT">
    <link>
        <predecessor elementType="road" elementId="4" contactPoint="end"/>
        <successor elementType="road" elementId="5" contactPoint="start"/>
    </link>
    ...
    <lanes>
        <laneSection s="0.0000000000000000e+00">
            <left>
                <lane id="1" type="driving" level="false">
                    <link>
                        <predecessor id="1"/>
                        <successor id="1"/>
                    </link>
                    ...
                </lane>
            </left>
            <center>
                <lane id="0">
                    ...
                </lane>
            </center>
            <right>
                <lane id="-1" type="driving" level="false">
                    <link>
                        <predecessor id="-1"/>
                        <successor id="-1"/>
                    </link>
                    ...
                </lane>
                <lane id="-2" type="curb" level="false">
                    <link>
                        <predecessor id="-2"/>
                        <successor id="-2"/>
                    </link>
                    ...
                </lane>
                <lane id="-3" type="walking" level="false">
                    <link>
                        <predecessor id="-3"/>
                        <successor id="-3"/>
                    </link>
                    ...
                </lane>
            </right>
        </laneSection>
    </lanes>
    ....
</road>
<road name="" length="9.4332512961489723e+00" id="75" junction="10" rule="RHT">
    <link/>
    ...
    <lanes>
        <laneSection s="0.0000000000000000e+00">
            <left>
                <lane id="1" type="walking" level="false">
                    <link/>
                    ...
                </lane>
            </left>
            <center>
                <lane id="0">
                    ...
                </lane>
            </center>
        </laneSection>
    </lanes>
    ...
</road>
<junction name="" id="10">
    <connection id="0" incomingRoad="4" connectingRoad="46" contactPoint="start">
        <laneLink from="-1" to="-1"/>
    </connection>
    <connection id="1" incomingRoad="4" connectingRoad="45" contactPoint="start">
        <laneLink from="-1" to="-1"/>
        <laneLink from="-2" to="-2"/>
        <laneLink from="-3" to="-3"/>
    </connection>
    ...
    <crossPath id="6" crossingRoad="75" roadAtStart="46" roadAtEnd="45">
        <startLaneLink s="5.0000000000000000e-01" from="3" to="1"/>
        <endLaneLink s="2.4841630000000000e-01" from="-3" to="1"/>
    </crossPath>
    ...
</junction>
```

**Rules**

The following rules apply to cross paths:

* [asam.net:xodr:1.8.0:junctions.cross\_path.within\_junction\_area](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-cross-path-within-junction-area): Cross paths shall be within the area of a common junction or a virtual junction.

* [asam.net:xodr:1.8.0:junctions.cross\_path.disregard\_cross\_road\_evelation](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-cross-path-disregard-cross-road-evelation): The elevations of the crossing road defined by the @crossingRoad attribute of the `<crossPath>` element are disregarded.

* [asam.net:xodr:1.8.0:junctions.cross\_path.lane\_linkage](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-cross-path-lane-linkage): Start and end of the crossing road shall reach the linked lanes specified by the `<startLaneLink>` and `<endLaneLink>` elements.

* [asam.net:xodr:1.8.0:junctions.cross\_path.start\_end\_contained](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-cross-path-start-end-contained): The start and end points of the crossing road and its lanes shall be fully contained within the linked lanes specified by the `<startLaneLink>` and `<endLaneLink>` elements.

* [asam.net:xodr:1.8.0:junctions.cross\_path.only\_connect\_correct\_type](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-cross-path-only-connect-correct-type): Cross paths shall only connect lanes with @type="walking" or @type="biking".

* [asam.net:xodr:1.8.0:junctions.cross\_path.correct\_junction\_id](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-cross-path-correct-junction-id): The @junction attribute shall contain the id of the junction to which a road belongs.

**Related topics**

* [Section 12.7.1, "Cross paths with virtual junctions"](12_07_virtual_junctions.html#sec-eaa19a5b-a1de-4002-bc9d-f9ac4d39f839)
* [Section 12.8, "Crossings"](12_08_crossings.html#top-910643c3-508f-48a9-91a4-dd180adbdb2d)

## 12.6 Direct junctions

Direct junctions are intended to model entries and exits without adding additional connecting roads.
This approach reduces the number of roads required to model entries and exits in comparison with the common junction modeling approach in  [Section 12.4, "Connecting roads"](12_04_connecting_roads.html#top-3e9bb97e-f2ab-4751-906a-c25e9fb7ac4e).

**Elements in UML model**

For elements in the UML model see [Figure 82](12_01_introduction.html#fig-8b7e2624-7c2f-4771-9e00-284dc2067532).

**`<junction type="direct">` element**

In ASAM OpenDRIVE, direct junctions are represented by `<junction>` elements with the value `direct` in the @type attribute within the `<junction>` element.

```
UML class:  t_junction_direct
XML tag:    <junction type="direct"> (Multiplicity: 0..*)
Introduced: 1.7.0
```

Direct junctions are intended to model entries and exits where drivable lanes may overlap to split or merge, but traffic does not cross.

<a id="tab-EAID_23FBBFBC_F067_4d1c_8602_856905727BF7"></a>
Table 66. Attributes of the <junction type="direct"> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `id` | string | required | ID of the junction to which the road belongs, for example connecting roads, cross paths, and roads of a junction boundary. Use -1 for none. |
| `name` | string | optional | Name of the junction. May be chosen freely. |
| `type` | [e\_junction\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_40D9549F_DB59_4440_A889_A09659446ED6) | required | Common junctions are of type "default". If the attribute is not specified, the junction type is "default". This attribute is mandatory for all other junction types. |

**`<connection>` element**

In ASAM OpenDRIVE, connections in direct junctions are represented by `<connection>` elements within the `<junction>` element.

```
UML class: t_junction_connection_direct
XML tag:   <connection> (Multiplicity: 1..*)
```

Provides information about a single connection within a direct junction.

<a id="tab-EAID_3BCD53D6_5C6D_4f1b_9CBE_1F832B68035C"></a>
Table 67. Attributes of the <connection> element

| Name | Type | Use | Introduced | Description |
| --- | --- | --- | --- | --- |
| `contactPoint` | [e\_contactPoint](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EF13C2F5_5229_46f8_983F_E8B6252DC5B7) | optional |  | Contact point on the @connectingRoad or @linkedRoad. Required for all junction types except virtual. |
| `id` | string | required |  | Unique ID within the junction |
| `incomingRoad` | string | optional |  | ID of the incoming road. Required for all junction types except virtual. |
| `linkedRoad` | string | required | 1.7.0 | ID of the directly linked road. Only to be used for junctions of @type="direct". |

**`<laneLink>` element**

In ASAM OpenDRIVE, lane links in direct junctions are represented by `<laneLink>` elements within the `<connection>` element.

```
UML class: t_junction_connection_laneLink
XML tag:   <laneLink> (Multiplicity: 0..*)
```

Provides information about the lanes that are linked between an incoming road and a connecting road.
It is strongly recommended to provide this element.
It is deprecated to omit the `<laneLink>` element.

<a id="tab-EAID_521D14A2_3AEB_4223_B1CB_4013672507CC"></a>
Table 68. Attributes of the <laneLink> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `from` | integer | required |  |  | ID of the incoming lane |
| `overlapZone` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | optional | m | 1.8.0 | Specifies the length of the area where traffic from both overlapping lanes shares the space. It is defined in s length relative to the position of the junction. Intended for direct junctions only. Default is 100. |
| `to` | integer | required |  |  | ID of the connection lane |

**Rules**

* [asam.net:xodr:1.8.0:junctions.direct.road\_connectivity](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-direct-road-connectivity): Direct junctions shall connect one road on one side with multiple roads on the other side.

* [asam.net:xodr:1.8.0:junctions.direct.split\_or\_merge](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-direct-split-or-merge): Direct junctions shall only be used for splitting or merging roads without crossing traffic.

* [asam.net:xodr:1.7.0:junctions.direct.correct\_type\_linked\_road\_usage](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-direct-correct-type-linked-road-usage): The @linkedRoad attribute shall only be used for junctions with @type="direct".

* [asam.net:xodr:1.7.0:junctions.direct.connecting\_road\_attribute\_usage](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-direct-connecting-road-attribute-usage): The @connectingRoad attribute shall not be used for junctions with @type="direct".

* [asam.net:xodr:1.7.0:junctions.direct.linked\_lane\_smoothness](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-direct-linked-lane-smoothness): The linked lanes shall fit smoothly as described for roads (see  [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)).

* [asam.net:xodr:1.7.0:junctions.direct.road\_ramp\_heading](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-junctions-direct-road-ramp-heading): The junction shall be placed where the headings of road, ramp, or slip lane are identical.

* [asam.net:xodr:1.8.0:junctions.direct.overlap\_zone\_exclusivity](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-direct-overlap-zone-exclusivity): Only one pair of `<laneLink>` elements shall have @overlapZone attributes to define the overlapping lanes.

* [asam.net:xodr:1.8.0:junctions.direct.overlap\_zone\_coverage](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-direct-overlap-zone-coverage): The value of the @overlapZone attribute shall cover at least the overlapping area, but may be larger.

* [asam.net:xodr:1.8.0:junctions.direct.flat\_exits\_entries](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-direct-flat-exits-entries): Currently only flat entries and exits can be modeled by overlapping direct junctions.

**Related topics**

* [Section 12.3, "Incoming roads"](12_03_incoming_roads.html#top-c0d5f9a9-a73a-4bcc-9a8c-393f357a559c)
* [Section 12.4, "Connecting roads"](12_04_connecting_roads.html#top-3e9bb97e-f2ab-4751-906a-c25e9fb7ac4e)
* [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
* [Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

<a id="_simple_direct_junction"></a>
### 12.6.1 Simple direct junction

<a id="fig-4172ceb7-d8ed-48f1-8139-ed8120ac1515"></a>
![img](../_images/12_junctions/direct_junction_1.png)

Figure 86. Direct junction

[Figure 86](#fig-4172ceb7-d8ed-48f1-8139-ed8120ac1515) shows a road connected to two linked roads.
Road `1` is directly linked to roads `2` and `3`.

**XML example**

The XML example shows the model that is displayed in [Figure 86](#fig-4172ceb7-d8ed-48f1-8139-ed8120ac1515).

```
<road name="" length="50" id="1" junction="-1">
    <link>
        <successor elementType="junction" elementId="111"/>
    </link>
</road>
<road name="" length="50" id="2" junction="-1">
    <link>
        <predecessor elementType="junction" elementId="111" />
    </link>
</road>
<road name="" length="50" id="3" junction="-1">
    <link>
        <predecessor elementType="junction" elementId="111" />
    </link>
</road>
<junction name="" type="direct" id="111">
    <connection id="0" incomingRoad="1" linkedRoad="3" contactPoint="start">
        <laneLink from="-4" to="-1"/>
    </connection>
    <connection id="1" incomingRoad="1" linkedRoad="2" contactPoint="start">
        <laneLink from="1" to="1"/>
        <laneLink from="-1" to="-1"/>
        <laneLink from="-2" to="-2"/>
        <laneLink from="-3" to="-3"/>
    </connection>
</junction>
```

<a id="_direct_junction_with_overlapping_lanes"></a>
### 12.6.2 Direct junction with overlapping lanes

<a id="fig-b70fa351-1697-411e-a028-b300c25b5cf8"></a>
![img](../_images/12_junctions/direct_junction_2.png)

Figure 87. Direct junction with overlapping lanes

[Figure 87](#fig-b70fa351-1697-411e-a028-b300c25b5cf8) shows one road connected to two following roads with overlapping lanes.
Traffic from lane `-3` of road `1` may continue in lane `-3` of road `2` or change to lane `-1` of road `3`.
Traffic from lane `-4` of road `1` changes to lane `-2` of road `3`.
The @overlapZone attribute specifies at least the length of the area where the traffic of the two overlapping lanes shares the space.

**XML example**

The XML example shows the model that is displayed in [Figure 87](#fig-b70fa351-1697-411e-a028-b300c25b5cf8).

```
<road name="" length="50" id="1" junction="-1">
    <link>
        <successor elementType="junction" elementId="111"/>
    </link>
</road>
<road name="" length="50" id="2" junction="-1">
    <link>
        <predecessor elementType="junction" elementId="111" />
    </link>
</road>
<road name="" length="50" id="3" junction="-1">
    <link>
        <predecessor elementType="junction" elementId="111" />
    </link>
</road>
<junction name="" type="direct" id="111">
    <connection id="0" incomingRoad="1" linkedRoad="3" contactPoint="start">
        <laneLink from="-3" to="-1" overlapZone="41"/>
        <laneLink from="-4" to="-2"/>
    </connection>
    <connection id="1" incomingRoad="1" linkedRoad="2" contactPoint="start">
        <laneLink from="1" to="1"/>
        <laneLink from="-1" to="-1"/>
        <laneLink from="-2" to="-2"/>
        <laneLink from="-3" to="-3" overlapZone="40"/>
    </connection>
</junction>
```

|  | *Determining which lanes overlap by reading the XML* Entries (slip lanes): Find `<laneLink>` elements with identical values of the @to attribute. The lanes of the two incoming roads overlap. Exits: Find `<laneLink>` elements with identical values of the @from attribute. The lanes of the two linked roads overlap. |
| --- | --- |
|  |  |

<a id="_unsolvable_cases_for_direct_junctions"></a>
### 12.6.3 Unsolvable cases for direct junctions

<a id="fig-24f9581b-5153-46c4-b3db-1712d4aa46d7"></a>
![img](../_images/12_junctions/direct_junction_3.png)

Figure 88. Junction with multiple overlapping lanes on two roads

[Figure 88](#fig-24f9581b-5153-46c4-b3db-1712d4aa46d7) shows one road connected to two following roads with multiple overlapping lanes.
Lane `-1` of road `3` overlaps lanes `-3` and `-4` of road `2`.
Lane `-2` of road `3` overlaps lane `-4` of road `2`.
Direct junctions cannot be used if multiple lanes overlap.
In this case common junctions shall be used (see  [Section 12.2, "Common junctions"](12_02_common_junctions.html#top-79fcd58e-0434-4188-a508-20effff8986e)).

<a id="fig-d6f158a8-5cf7-43f9-8189-88e462f0d5eb"></a>
![img](../_images/12_junctions/direct_junction_4.png)

Figure 89. Junction with multiple overlapping lanes on multiple roads

[Figure 89](#fig-d6f158a8-5cf7-43f9-8189-88e462f0d5eb) shows one road connected to three following roads with overlapping lanes.
Lane `-1` of road `2` overlaps lane `-1` of road `3`.
Lane `-1` of road `4` overlaps lane `-3` of road `3`.
Direct junctions cannot be used if multiple lanes overlap.
In this case common junctions shall be used (see  [Section 12.2, "Common junctions"](12_02_common_junctions.html#top-79fcd58e-0434-4188-a508-20effff8986e)).

<a id="fig-74b2fe27-8545-4030-a2d6-4e3206410b65"></a>
![img](../_images/12_junctions/direct_junction_5.png)

Figure 90. Junction with crossing traffic and multiple overlapping lanes on multiple roads

[Figure 90](#fig-74b2fe27-8545-4030-a2d6-4e3206410b65) shows two roads connected to two following roads with crossing traffic.
Traffic from lane `-3` of road `1` to lane `-1` of road `4` crosses traffic from lane `-1` of road `3` to lane `-3` of road `2`.
Direct junctions cannot be used if traffic crosses.
In addition to the crossing traffic this junction also has multiple overlapping lanes and more than one road on both sides.
In this case common junctions shall be used (see  [Section 12.2, "Common junctions"](12_02_common_junctions.html#top-79fcd58e-0434-4188-a508-20effff8986e)).

## 12.7 Virtual junctions

Virtual junctions are junctions that describe connections within a road without the need to cut the main road.
They are intended as best practice, for example, for the following use cases:

* Modeling driveways
* Modeling entries and exits to parking lots
* Modeling entries and exits to farm roads

<a id="fig-916edd72-61e8-4549-8268-b7b9437da858"></a>
![img](../_images/12_junctions/junction_3.png)

Figure 91. Example of a virtual junction showing a parking lot entry and exit

[Figure 91](#fig-916edd72-61e8-4549-8268-b7b9437da858) shows a virtual junction with three connecting roads `2`, `4` and `5`.
The virtual junction connects road `1` with road `99`.
Road `1` serves as an incoming road for connecting road `2` at the @sStart position s=50m.
Road `99` serves as incoming road for road `4` and road `5`.
Road `1` is successor for the two connecting roads `4` and `5` at @sEnd s=70m.
The successor is specified in the road definition of the connecting roads.

Virtual junctions are modeled by `<junction>` elements with the @type attribute.

**Elements in UML model**

For elements in the UML model see [Figure 82](12_01_introduction.html#fig-8b7e2624-7c2f-4771-9e00-284dc2067532).

**`<junction type="virtual">` element**

In ASAM OpenDRIVE, virtual junctions are represented by `<junction>` elements with the value `virtual` in the @type attribute within the `<OpenDRIVE>` element.

```
UML class: t_junction_virtual
XML tag:   <junction type="virtual"> (Multiplicity: 0..*)
```

Virtual junctions manage connections within an uninterrupted road, for example, entries and exits to parking lots, and pedestrian crossings.

<a id="tab-EAID_F8BC2079_2864_434a_93CC_45F6678DC598"></a>
Table 69. Attributes of the <junction type="virtual"> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `id` | string | required |  | ID of the junction to which the road belongs, for example connecting roads, cross paths, and roads of a junction boundary. Use -1 for none. |
| `mainRoad` | string | required |  | The main road from which the connecting roads of the virtual junction branch off. This attribute is mandatory for virtual junctions and shall not be specified for other junction types. |
| `name` | string | optional |  | Name of the junction. May be chosen freely. |
| `orientation` | [e\_orientation](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D8972119_8CE4_407e_A4AD_3183B0B5C687) | required |  | Defines the relevance of the virtual junction according to the driving direction. This attribute is mandatory for virtual junctions and shall not be specified for other junction types. The enumerator "none" specifies that the virtual junction is valid in both directions. |
| `sEnd` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | End position of the virtual junction in the reference line coordinate system. This attribute is mandatory for virtual junctions. |
| `sStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Start position of the virtual junction in the reference line coordinate system. This attribute is mandatory for virtual junctions. |
| `type` | [e\_junction\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_40D9549F_DB59_4440_A889_A09659446ED6) | required |  | Common junctions are of type "default". If the attribute is not specified, the junction type is "default". This attribute is mandatory for all other junction types. |

**`<connection type="default">` element**

In ASAM OpenDRIVE, the connections are represented by `<connection>` elements with the value `default` in the @type attribute within the `<junction>` element.

```
UML class: t_junction_connection_virtual_default
XML tag:   <connection type="default"> (Multiplicity: 0..*)
```

Provides information about a single connection within a virtual junction.

<a id="tab-EAID_F4866D31_20E1_4a3f_8998_258F76829FE8"></a>
Table 70. Attributes of the <connection type="default"> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `connectingRoad` | string | required |  |
| `contactPoint` | [e\_contactPoint](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EF13C2F5_5229_46f8_983F_E8B6252DC5B7) | optional | Contact point on the @connectingRoad or @linkedRoad. Required for all junction types except virtual. |
| `id` | string | required | Unique ID within the junction |
| `incomingRoad` | string | optional | ID of the incoming road. Required for all junction types except virtual. |
| `type` | [e\_connection\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_F48B9907_F898_46fd_A4AC_01A14BC1B4AE) | optional | Type of the connection. Regular connections are @type=“default” . This attribute is mandatory for virtual connections. |

**`<laneLink>` element**

In ASAM OpenDRIVE, lane links in virtual junctions are represented by `<laneLink>` elements within the `<connection>` element.

```
UML class: t_junction_connection_laneLink
XML tag:   <laneLink> (Multiplicity: 0..*)
```

Provides information about the lanes that are linked between an incoming road and a connecting road.
It is strongly recommended to provide this element.
It is deprecated to omit the `<laneLink>` element.

<a id="tab-EAID_521D14A2_3AEB_4223_B1CB_4013672507CC"></a>
Table 71. Attributes of the <laneLink> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `from` | integer | required |  |  | ID of the incoming lane |
| `overlapZone` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | optional | m | 1.8.0 | Specifies the length of the area where traffic from both overlapping lanes shares the space. It is defined in s length relative to the position of the junction. Intended for direct junctions only. Default is 100. |
| `to` | integer | required |  |  | ID of the connection lane |

**XML example**

```
<road name="ConnectingRoad2" length="20" id="2" junction="555">
    <link>
        <predecessor elementType="road" elementId="1" elementS="50.0" elementDir="+"/>
        <successor elementType="road" elementId="99" contactPoint="end"/>
    </link>
    <laneSection s="0.0000000000000000e+00">
        <left/>
        <center/>
        <right>
            <lane id="-1" type="driving" level="false">
                <link>
                    <predecessor id="-2"/>
                    <successor id="1"/>
                </link>
            </lane>
        </right>
    </laneSection>
</road>
<road name="ConnectingRoad4" length="23" id="4" junction="555">
    <link>
        <predecessor elementType="road" elementId="99" contactPoint="end"/>
        <successor elementType="road" elementId="1" elementS="70.0" elementDir="+"/>
    </link>
    <laneSection s="0.0000000000000000e+00">
        <left/>
        <center/>
        <right>
            <lane id="-1" type="driving" level="false">
                <link>
                    <predecessor id="-1"/>
                    <successor id="-1"/>
                </link>
            </lane>
        </right>
    </laneSection>
</road>
<road name="ConnectingRoad5" length="20" id="5" junction="555">
    <link>
        <predecessor elementType="road" elementId="99" contactPoint="end"/>
        <successor elementType="road" elementId="1" elementS="70.0" elementDir="+"/>
    </link>
    <laneSection s="0.0000000000000000e+00">
        <left/>
        <center/>
        <right>
            <lane id="-1" type="driving" level="false">
                <link>
                    <predecessor id="-1"/>
                    <successor id="-2"/>
                </link>
            </lane>
        </right>
    </laneSection>
</road>
...
<junction name="myJunction" type="virtual" id="555" mainRoad="1" sStart="50" sEnd="70" orientation="+">
    <connection id="0" incomingRoad="1" connectingRoad="2" contactPoint="start">
        <laneLink from="-2" to="-1"/>
    </connection>
    <connection id="1" incomingRoad="99" connectingRoad="4" contactPoint="start">
        <laneLink from="-1" to="-1"/>
    </connection>
    <connection id="2" incomingRoad="99" connectingRoad="5" contactPoint="start">
        <laneLink from="-1" to="-1"/>
    </connection>
</junction>
```

**Rules**

The following rules apply to virtual junctions:

* The main incoming road within a virtual junction does not need to end before the junction area.
* Virtual junctions shall not replace common junctions and crossings that connect multiple roads.
* Virtual junctions shall be used for branches off the main road only. The main road has priority if not specified otherwise.
* Virtual junctions shall not have controllers and therefore no traffic lights.
* If no incoming road is defined the @incomingRoad attribute has the value `-1`.
* All connecting roads within the virtual junction shall either start or end at @sStart or at @sEnd.
* There shall only be one @sStart and one @sEnd attribute for the virtual junction.
* The heading of the connecting roads and the @mainRoad shall be equal at @sStart and at @sEnd.
* The linked lanes shall fit smoothly (see  [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)).
* The @mainRoad, @sStart, @sEnd, @orientation attributes shall only be valid for junctions of type virtual.
* Currently only flat virtual junctions can be modeled.
* The @overlapZone attribute shall only be specified for direct junctions.

**Related topics**

* [Section 12.14, "Signal synchronization groups in junctions"](12_14_signal_synchronization_groups.html#top-add49732-8747-40b6-93b0-1b3ff20afeb9)
* [Section 12.1, "Introduction to junctions"](12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)
* [Section 12.3, "Incoming roads"](12_03_incoming_roads.html#top-c0d5f9a9-a73a-4bcc-9a8c-393f357a559c)
* [Section 12.4, "Connecting roads"](12_04_connecting_roads.html#top-3e9bb97e-f2ab-4751-906a-c25e9fb7ac4e)
* [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
* [Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

<a id="sec-eaa19a5b-a1de-4002-bc9d-f9ac4d39f839"></a>
### 12.7.1 Cross paths with virtual junctions

Cross paths with virtual junctions are modeled within the `<junction>` element with @type="virtual".
The value of the @mainRoad attribute defines the crossed road and the values of the @sStart and @sEnd attributes define the section with the cross path.

<a id="fig-5a5d68e9-1201-48c1-9caf-ebe950cb94de"></a>
![img](../_images/12_junctions/cross_path.png)

Figure 92. Example of a cross path with a pedestrian crossing

[Figure 92](#fig-5a5d68e9-1201-48c1-9caf-ebe950cb94de) shows the road with @id="2" as cross path to connect the lanes with @id="-2" and @id="3" of the road with @id="1".

**XML example**

```
<road name="drivingRoad" length="200" id="1" junction="-1">
    <link>...</link>
    <planView>
        <geometry>...
            <line/>
        </geometry>
    </planView>
    <lanes>
        <laneSection s="0.0000000000000000e+00">
            <left>
                <lane id="3" type="walking">
                    <link>...</link>
                </lane>
                <lane id="2" type="driving">
                    <link>...</link>
                </lane>
                <lane id="1" type="driving">
                    <link>...</link>
                </lane>
            </left>
            <center>...</center>
            <right>
                <lane id="-1" type="driving">
                    <link>...</link>
                </lane>
                <lane id="-2" type="walking">
                    <link>...</link>
                </lane>
            </right>
        </laneSection>
        <laneSection s="5.0000000000000000e+01">
            <left>
                <lane id="3" type="walking">
                    <link>...</link>
                </lane>
                <lane id="2" type="driving">
                    <link>...</link>
                </lane>
                <lane id="1" type="restricted">
                    <link>...</link>
                </lane>
            </left>
            <center>...</center>
            <right>
                <lane id="-1" type="driving" level="false">
                    <link>...</link>
                </lane>
                <lane id="-2" type="walking">
                    <link>...</link>
                </lane>
            </right>
        </laneSection>
        <laneSection s="6.0000000000000000e+01">
            <left>
                <lane id="3" type="walking">
                    <link>...</link>
                </lane>
                <lane id="2" type="driving">
                    <link>...</link>
                </lane>
                <lane id="1" type="driving">
                    <link>...</link>
                </lane>
            </left>
            <center>...</center>
            <right>
                <lane id="-1" type="driving" level="false">
                    <link>...</link>
                </lane>
                <lane id="-2" type="walking">
                    <link>...</link>
                </lane>
            </right>
        </laneSection>
    </lanes>
    ...
</road>
<road name="pedestrian" length="12" id="2" junction="555">
    <link>...</link>
    <lanes>
        <laneSection s="0.0000000000000000e+00">
            <left/>
            <center>...</center>
            <right>
                <lane id="-1" type="walking">
                    <link/>
                </lane>
            </right>
        </laneSection>
    </lanes>
</road>
...
<junction name="pedestrianCrossPath" type="virtual" id="555" mainRoad="1" sStart="52" sEnd="58">
    <priority high="1" low="2"/>
    <crossPath id="0" crossingRoad="2" roadAtStart="1" roadAtEnd="1">
        <startLaneLink s="5.40000000000000000e+01" from="-2" to="-1"/>
        <endLaneLink s="5.4000000000000000e+01" from="3" to="-1"/>
    </crossPath>
</junction>
```

**Rules**

The following rules apply to cross paths with virtual junctions:

* The elevations of the crossing road defined by the @crossingRoad attribute of the `<crossPath>` element are disregarded.

* [asam.net:xodr:1.8.0:junctions.virtual.crossPath.cross\_road\_check\_s\_t](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-virtual-crosspath-cross-road-check-s-t): The crossing road shall not exceed the values for s and t of the main road defined by the @roadAtStart and @roadAtEnd attributes.

* Start and end of the crossing road shall reach the linked lanes specified by the `<startLaneLink>` and `<endLaneLink>` elements.
* Cross paths shall only connect lanes with @type="walking" or @type="biking".

**Related topics**

* [Section 12.5, "Cross paths"](12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)
* [Section 12.8, "Crossings"](12_08_crossings.html#top-910643c3-508f-48a9-91a4-dd180adbdb2d)

<a id="sec-7e990ee5-5ab1-4346-886e-bb4766a78032"></a>
### 12.7.2 Virtual connections (deprecated)

Virtual connections are deprecated and indicate possible connections between two roads or one or more lanes of two roads.
Because the indicated connections are only virtual, no real path is defined.
That means that the course of the reference line is not changed.

Virtual connections describe topological connections between roads and lanes.
They do not need to be geometrically correct.

<a id="fig-c7e99704-3f7e-476e-8bf4-54e0836c670f"></a>
![img](../_images/12_junctions/junction_4.png)

Figure 93. Virtual junction with virtual connections

[Figure 93](#fig-c7e99704-3f7e-476e-8bf4-54e0836c670f) shows a virtual junction with virtual connections.

**Elements in UML model**

For elements in the UML model see [Figure 82](12_01_introduction.html#fig-8b7e2624-7c2f-4771-9e00-284dc2067532).

**`<connection type="virtual">` element**

In ASAM OpenDRIVE, virtual connections are represented by `<connection>` elements with the value `virtual` in the @type attribute within the `<junction>` element.

```
UML class:  t_junction_connection_virtual
XML tag:    <connection type="virtual"> (Multiplicity: 0..*)
Deprecated: 1.8.0
```

Virtual connections indicate possible connections between two roads or one or more lanes of two roads.
Virtual connections do not specify connecting roads.

<a id="tab-EAID_01E1E803_3900_4ad0_84FE_A136EFAA030A"></a>
Table 72. Attributes of the <connection type="virtual"> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `connectingRoad` | string | required |  |
| `contactPoint` | [e\_contactPoint](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EF13C2F5_5229_46f8_983F_E8B6252DC5B7) | optional | Contact point on the @connectingRoad or @linkedRoad. Required for all junction types except virtual. |
| `id` | string | required | Unique ID within the junction |
| `incomingRoad` | string | optional | ID of the incoming road. Required for all junction types except virtual. |
| `type` | [e\_connection\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_F48B9907_F898_46fd_A4AC_01A14BC1B4AE) | required | Type of the connection. Regular connections are @type=“default” . This attribute is mandatory for virtual connections. |

**`<predecessor>` and `<successor>` element**

In ASAM OpenDRIVE, predecessors and successors of virtual connections are represented by `<predecessor>` and `<successor>` elements within the `<connection>` element.

```
UML class:  t_junction_predecessorSuccessor
XML tag:    <predecessor> (Multiplicity: 1)
XML tag:    <successor> (Multiplicity: 1)
Deprecated: 1.8.0
```

Provides detailed information about the predecessor / successor road of a virtual connection.
Currently, only the @elementType “road” is allowed.

<a id="tab-EAID_AFCAD33E_B934_4abf_9BA7_4E267ADC49C5"></a>
Table 73. Attributes of the <predecessor> and <successor> elements

| Name | Type | Use | Deprecated | Description |
| --- | --- | --- | --- | --- |
| `elementDir` | [e\_elementDir](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D1E21B53_3817_4627_8EC7_24415D264892) | required | 1.8.0 | Direction, relative to the s-direction, of the connection on the preceding / succeeding road |
| `elementId` | string | required | 1.8.0 | ID of the linked element |
| `elementS` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | 1.8.0 | s-coordinate where the connection meets the preceding / succeeding road. |
| `elementType` | string | required | 1.8.0 | Type of the linked element. Currently only "road" is allowed. |

**XML example**

```
<junction name="myJunction" type="virtual" id="555" >
    <connection id="0" incomingRoad="1" connectingRoad="2" contactPoint="start">
        <laneLink from="-2" to="-1"/>
    </connection>
    <connection id="1" incomingRoad="99" connectingRoad="4" contactPoint="start">
        <laneLink from="-1" to="-1"/>
    </connection>
    <connection id="2" incomingRoad="99" connectingRoad="5" contactPoint="start">
        <laneLink from="-1" to="-2"/>
    </connection>
    <connection id="3" type="virtual">
        <predecessor elementType="road" elementId="99" contactPoint="end"/>
        <successor   elementType="road" elementId="1" elementS="60.0" elementDir="-"/>
        <laneLink from="-1" to="1"/>
    </connection>
    <connection id="4" type="virtual">
        <predecessor elementType="road" elementId="99" contactPoint="end"/>
        <successor elementType="road" elementId="1"  elementS="60.0" elementDir="-"/>
        <laneLink from="-1" to="2"/>
    </connection>
    <connection id="5" type="virtual">
        <predecessor elementType="road" elementId="1" elementS="70.0" elementDir="-"/>
        <successor elementType="road" elementId="99" contactPoint="end"/>
            <laneLink from="1" to="1"/>
        </connection>
    </junction>
```

**Rules**

The following rules apply to virtual connections:

* Virtual connections shall not replace regular geometrical elements described by road linkage and lane linkage.
* Virtual connections shall only be defined in virtual junctions.

**Related topics**

* [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
* [Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

## 12.8 Crossings

Crossings are junctions where traffic of two or more different roads crosses at the same level, but the traffic cannot change the roads at crossings.

Crossings are intended as best practice, for example, for the following use cases:

* Railroad crossings
* Pedestrian crossings
* Bicycle crossings

Crossings are similar to virtual junctions from the driving point of view, but without any connections.
Elevation definitions via CRG or elevation grid are possible.

**Elements in UML model**

**`<junction type="crossing">` element**

In ASAM OpenDRIVE, crossings are represented by `<junction>` elements with the value `crossing` in the @type attribute within the `<OpenDRIVE>` element.

```
UML class:  t_junction_crossing
XML tag:    <junction type="crossing"> (Multiplicity: 0..*)
Introduced: 1.8.0
```

Crossings are junctions without connecting roads.
They define sections where crossing traffic can appear.
Traffic does not change roads at crossings, for example, at railway crossings.

<a id="tab-EAID_7EFB7A3F_4F54_46c4_A64A_EAA09CB2B97D"></a>
Table 74. Attributes of the <junction type="crossing"> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `id` | string | required | ID of the junction to which the road belongs, for example connecting roads, cross paths, and roads of a junction boundary. Use -1 for none. |
| `name` | string | optional | Name of the junction. May be chosen freely. |
| `type` | [e\_junction\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_40D9549F_DB59_4440_A889_A09659446ED6) | required | Common junctions are of type "default". If the attribute is not specified, the junction type is "default". This attribute is mandatory for all other junction types. |

**`<roadSection>` element**

In ASAM OpenDRIVE, the ranges with possible crossing traffic at crossings are represented by `<roadSection>` elements within the `<junction>` element.

```
UML class:  t_junction_roadSection
XML tag:    <roadSection> (Multiplicity: 1..*)
Introduced: 1.8.0
```

Define the s range of the crossing roads with possible crossing traffic.

<a id="tab-EAID_D9186087_71B4_40bb_86FD_6647F6EFE7A3"></a>
Table 75. Attributes of the <roadSection> element

| Name | Type | Use | Introduced | Description |
| --- | --- | --- | --- | --- |
| `id` | string | required | 1.8.0 | Unique ID within the junction |
| `roadId` | string | required | 1.8.0 | ID of the road of this roadSection element |
| `sEnd` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | 1.8.0 | End position of the crossing junction in the road reference line coordinate system. This attribute is mandatory for crossing junctions. |
| `sStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | 1.8.0 | Start position of the crossing junction in the road reference line coordinate system. This attribute is mandatory for crossing junctions. |

**XML example**

<a id="fig-9d5b81e2-9636-493e-a6ac-8548c2dcbf58"></a>
![img](../_images/12_junctions/crossing_rail.png)

Figure 94. Example of a crossing with a railroad track

[Figure 94](#fig-9d5b81e2-9636-493e-a6ac-8548c2dcbf58) shows a crossing of the roads with @id="1" and @id="2".
The road with @id="1" is for normal traffic and uses lanes with @type="driving".
The road with @id="2" is a railroad track and uses a lane with @type="rail".
Traffic on the road with @id="2" has priority.
For both roads `<roadSection>` elements define with the values of the @sStart and @sEnd attributes the section where traffic crosses.

```
<road name="DrivingRoad1" length="200" id="1" junction="-1">
    <laneSection s="0.0000000000000000e+00">
        <left>
            <lane id="1" type="driving"/>
        </left>
        <center/>
        <right>
            <lane id="-1" type="driving"/>
        </right>
    </laneSection>
</road>
<road name="RAILRoad" length="2300" id="2" junction="-1">
    <laneSection s="0.0000000000000000e+00">
        <left/>
        <center/>
        <right>
            <lane id="-1" type="rail"/>
        </right>
    </laneSection>
</road>
...
<junction name="myRailCrossing" type="crossing" id="555">
    <priority high="2" low="1"/>
    <roadSection id="0" roadId="1" sStart="50" sEnd="60"/>
    <roadSection id="1" roadId="2" sStart="150" sEnd="160"/>
</junction>
```

**Rules**

The following rules apply to crossings:

* [asam.net:xodr:1.8.0:junctions.crossing.only\_road\_sections](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-crossing-only-road-sections): Junctions with @type="crossing" shall only have `<roadSection>` elements.

* [asam.net:xodr:1.8.0:junctions.crossing.only\_one\_high\_prio](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-crossing-only-one-high-prio): Only one road defined by the @roadId attributes of the `<roadSection>` elements shall have `high` priority.

* [asam.net:xodr:1.8.0:junctions.crossing.s\_start\_end\_coverage](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-crossing-s-start-end-coverage): The values for the @sStart and @sEnd attributes of the `<roadSection>` elements shall at least cover the area where the roads overlap.

* Currently only flat crossings can be modeled.

**Related topics**

* [Section 12.5, "Cross paths"](12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)
* [Section 12.7.1, "Cross paths with virtual junctions"](12_07_virtual_junctions.html#sec-eaa19a5b-a1de-4002-bc9d-f9ac4d39f839)

## 12.9 Junction reference line

Junction reference lines are geometric references related to junctions.
A junction reference line is defined in the reference line coordinate system.
A junction reference line attaches the `<elevationGrid>` element and other relevant objects to the junction, for example traffic islands or potholes.
A junction reference line has no lanes and no elevation or superelevation.

<a id="fig-298faa87-6415-4285-8c8f-8e9c10bb8c97"></a>
![img](../_images/12_junctions/junction_reference_line.png)

Figure 95. Junction reference line ~red arrow~

[Figure 95](#fig-298faa87-6415-4285-8c8f-8e9c10bb8c97) shows a junction and a junction reference line.

In ASAM OpenDRIVE, junction reference lines are represented by the `<planView>` element within the `<junction>` element.

```
UML class: t_road_planView
XML tag:   <planView> (Multiplicity: 1)
```

Contains geometry elements that define the layout of the road reference line in the x/y-plane (plan view).

**`<geometry>` element**

In ASAM OpenDRIVE, the geometry of a junction reference line is represented by the `<geometry>` element within the `<planView>` element.

```
UML class: t_road_planView_geometry
XML tag:   <geometry> (Multiplicity: 1..*)
```

<a id="tab-EAID_4362A665_123D_42ec_9704_B56EBA7ADD25"></a>
Table 76. Attributes of the <geometry> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `hdg` | double | required | rad | Start orientation (inertial heading) |
| `length` | [t\_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13) | required | m | Length of the element’s reference line |
| `s` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | s-coordinate of start position |
| `x` | double | required | m | Start position (x inertial) |
| `y` | double | required | m | Start position (y inertial) |

The `<planView>` element contains one `<geometry>` element with the `<line>` element.

**XML example**

```
<junction id="15">
    <planView>
        <geometry s="0.0000000000000000e+00"
                  x="3.0505642010572856e+01"
                  y="3.6353713565101820e+01"
                  hdg="2.9842438203363086e-01"
                  length="7.5257400000000004e+01">
            <line/>
        </geometry>
    </planView>
    <object type="roadSurface" subtype="pothole" name="" id="1" s="3.1064163564293011e+01" t="1.6886219784199805e+00" zOffset="0.0000000000000000e+00" validLength="0.0000000000000000e+00" orientation="none" length="0.3179999999999999e+00" width="0.4229999999999999e+00" height="0.0000000000000000e+00" hdg="5.7401170550235827e+00" pitch="0.0000000000000000e+00" roll="0.0000000000000000e+00">
        <surface>
          <CRG file="pothole.crg" hideRoadSurfaceCRG="true" zScale="1"/>
        </surface>
      </object>
</junction>
```

**Rules**

The following rules apply to junction reference lines:

* [asam.net:xodr:1.8.0:junctions.geometry.only\_one\_line\_element](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-geometry-only-one-line-element): Junction reference lines shall be defined by one `<geometry>` element. This `<geometry>` element shall have only one `<line>` element.

* [asam.net:xodr:1.8.0:junctions.geometry.ref\_line\_definition](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-geometry-ref-line-definition): The `<geometry>` element of a junction reference line shall be defined in a way that every point of the junction can be reached with a perpendicular straight line.

* [asam.net:xodr:1.8.0:junctions.geometry.correct\_junction\_boundry](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-geometry-correct-junction-boundry): If a junction boundary is specified, a junction reference line shall cross the junction boundary or be at least tangent to the junction boundary at one point.

**Related topics**

* [Section 12.11, "Junction elevation grid"](12_11_junction_elevation_grid.html#top-26a9b5c3-a1f1-4958-b8da-4ce704ae96fc)
* [Section 12.10, "Junction boundary"](12_10_junction_boundary.html#top-6d1f0b2f-282b-4d48-a920-be13f75706a3)

## 12.10 Junction boundary

Junction boundaries define the outermost edge of the full area for common junctions, where the `<elevationGrid>` is applied to all points within this boundary.
A junction boundary consists of segments that run along the outmost edge of a given lane or perpendicular to lanes connected to the junction and should include all sidewalks or similar lanes.
Segments run counter clockwise around the junction and form a closed junction boundary.
The boundary can also specify a transition zone where local height is interpolated between road data and the `<elevationGrid>` in order to ensure a smooth transition from the roads outside of the junction onto the grid and vice versa.

**Elements in UML model**

**`<boundary>` element**

In ASAM OpenDRIVE, junction boundaries are represented by the `<boundary>` element within the `<junction>` element.

```
UML class:  t_junction_boundary
XML tag:    <boundary> (Multiplicity: 0..1)
Introduced: 1.8.0
```

Junction boundaries enclose the area intended for traffic.
This also includes the sidewalks for pedestrians.

<a id="fig-b10e5b4c-ec68-4b44-b4e7-dd5ccce00aca"></a>
![img](../_images/uml_class_diagrams/EAID_B37C31C9_20D3_450d_9BA3_A32B2F47FA82.png)

Figure 96. UML class diagram of the JunctionGeometry class

[Figure 96](#fig-b10e5b4c-ec68-4b44-b4e7-dd5ccce00aca) shows the UML class diagram of the ASAM OpenDRIVE JunctionGeometry class.

**`<segment type="lane">` element**

In ASAM OpenDRIVE, segments along lanes are represented by `<segment>` elements with the value `lane` in the @type attribute within the `<boundary>` element.
The order of the `<segment>` elements represent the segments in counterclockwise order around the junction.

```
UML class:  t_junction_boundary_segment_lane
XML tag:    <segment type="lane"> (Multiplicity: 1..*)
Introduced: 1.8.0
```

A segment element with @type="lane" goes along @boundaryLane for the given s range.
It is the outmost edge of the lane relative to the center of the junction.

<a id="tab-EAID_C634F789_4C6D_4e20_B214_83DBAECD02F4"></a>
Table 77. Attributes of the <segment type="lane"> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `boundaryLane` | int | required |  | 1.8.0 | ID of the lane of which the outer edge is the segment |
| `roadId` | string | required |  | 1.8.0 | ID of the road used for the segment |
| `sEnd` | [t\_grEqZeroOrContactPoint](../16_annexes/map_uml_data_types.html#top-EAID_2467CAA3_B070_4f21_85B0_255F09E84E26) | required | m | 1.8.0 | End of the segment (s-coordinate, begin, end) |
| `sStart` | [t\_grEqZeroOrContactPoint](../16_annexes/map_uml_data_types.html#top-EAID_2467CAA3_B070_4f21_85B0_255F09E84E26) | required | m | 1.8.0 | Start of the segment (s-coordinate, begin, end) |
| `type` | [e\_junction\_segment\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B80E83B2_0168_47c9_89E8_6F6B291D23B2) | required |  | 1.8.0 | Type of the segment |

**`<segment type="joint">` element**

In ASAM OpenDRIVE, segments perpendicular to lanes are represented by `<segment>` elements with the value `joint` in the @type attribute within the `<boundary>` element.
The order of the `<segment>` elements represent the segments in counterclockwise order around the junction.

```
UML class:  t_junction_boundary_segment_joint
XML tag:    <segment type="joint"> (Multiplicity: 1..*)
Introduced: 1.8.0
```

A segment element with @type="joint" is perpendicular to the start or end of the given road.

<a id="tab-EAID_EE6D34AF_4FA9_4875_B7CF_BA433E5F75DA"></a>
Table 78. Attributes of the <segment type="joint"> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `contactPoint` | [t\_grEqZeroOrContactPoint](../16_annexes/map_uml_data_types.html#top-EAID_2467CAA3_B070_4f21_85B0_255F09E84E26) | required |  | 1.8.0 | Contact point on the road |
| `jointLaneEnd` | int | optional |  | 1.8.0 | ID of the lane crossed by the segment. If missing all lanes are crossed by the segment. |
| `jointLaneStart` | int | optional |  | 1.8.0 | ID of the lane crossed by the segment. If missing all lanes are crossed by the segment. |
| `roadId` | string | required |  | 1.8.0 | ID of the road used for the segment |
| `transitionLength` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | optional | m | 1.8.0 | Length of the transition area where local height is interpolated between road data and the `<elevationGrid>` in order to ensure a smooth transition. The default is 0. |
| `type` | [e\_junction\_segment\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B80E83B2_0168_47c9_89E8_6F6B291D23B2) | required |  | 1.8.0 | Type of the segment |

**XML example**

<a id="fig-7b71d8b5-f9bd-4b6a-9abf-3cffaae82953"></a>
![img](../_images/12_junctions/junction_boundary_segments.png)

Figure 97. Junction boundary formed by segments

[Figure 97](#fig-7b71d8b5-f9bd-4b6a-9abf-3cffaae82953) shows a junction boundary out of various segments along lanes or perpendicular to lanes. The road with @id="100" has the sole purpose to provide a lane segment that closes the junction boundary at the gap between the road with @id="60" and the road with @id="3".

```
<junction>
    <boundary>
        <segment type="lane" roadId="8" boundaryLane="-2" sStart="begin" sEnd="end"/>
        <segment type="joint" roadId="2" contactPoint="end" jointLaneStart="2" jointLaneEnd="-1"/>
        <segment type="lane" roadId="17" boundaryLane="-1" sStart="begin" sEnd="end"/>
        <segment type="joint" roadId="3" contactPoint="start"/>
        <segment type="lane" roadId="100" boundaryLane="0" sStart="begin" sEnd="end"/>
        <segment type="joint" roadId="60" contactPoint="start" jointLaneStart="0" jointLaneEnd="2"/>
        <segment type="lane" roadId="52" boundaryLane="0" sStart="end" sEnd="begin"/>
        <segment type="joint" roadId="4" contactPoint="end" jointLaneStart="1" jointLaneEnd="-2"/>
        <segment type="lane" roadId="32" boundaryLane="-2" sStart="begin" sEnd="42.0"/>
        <segment type="lane" roadId="32" boundaryLane="-1" sStart="42.0" sEnd="end"/>
        <segment type="joint" roadId="5" contactPoint="end" jointLaneStart="1" jointLaneEnd="-2"/>
        <segment type="lane" roadId="41" boundaryLane="-2" sStart="begin" sEnd="end"/>
        <segment type="joint" roadId="1" contactPoint="start" jointLaneStart="-2" jointLaneEnd="2"/>
    </boundary>
</junction>
```

**Rules**

The following rules apply to junction boundaries:

* [asam.net:xodr:1.8.0:junctions.boundary.only\_for\_common\_junctions](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-boundary-only-for-common-junctions): Junction boundaries are currently only valid for common junctions.

* [asam.net:xodr:1.8.0:junctions.boundary.segments\_counter\_clockwise\_order](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-boundary-segments-counter-clockwise-order): Segments shall be ordered counter clockwise.

* [asam.net:xodr:1.8.0:junctions.boundary.segments\_for\_each\_conn\_road](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-boundary-segments-for-each-conn-road): Segments shall be defined to reach the start or end of all roads connected to the junction.

* [asam.net:xodr:1.8.0:junctions.boundary.segments\_close\_boundry](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-boundary-segments-close-boundry): Segments shall close the entire junction boundary.

* [asam.net:xodr:1.8.0:junctions.boundary.close\_gap\_with\_new\_roads](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-boundary-close-gap-with-new-roads): If the existing roads are not sufficient to define a closed junction boundary, additional roads shall be defined for the missing segments.

These additional roads shall follow the rules of road linkage to the incoming roads, outgoing roads, or connecting roads (see  [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)),
but are not required to have any lanes or connections.
Start and end of an additional road shall point away from both incoming and/or outgoing roads to the inside of the junction.
The @junction attribute shall contain the id of the junction to which the road belongs.

**Related topics**

* [Section 12.9, "Junction reference line"](12_09_junction_reference_line.html#top-c53f51c5-e3c1-4c7e-bc61-efdf4f0bf54c)
* [Section 12.11, "Junction elevation grid"](12_11_junction_elevation_grid.html#top-26a9b5c3-a1f1-4958-b8da-4ce704ae96fc)

## 12.11 Junction elevation grid

Elevation grids provide and overwrite elevation definitions for every point inside the junction boundary.
Elevation grids solve the issue of connecting roads with different z-values and gaps.
If a lane height (see [Section 11.6.1, "Lane height"](../11_lanes/11_06_lane_geometry.html#sec-d30c9ef9-cb82-4683-9fb6-6487e9dffd2f)) is present, the values are superimposed onto the grid values in order to model sidewalks etc.

An elevation grid is a coarse square grid with z-values at evenly spaced points.
Elevation grids do not replace ASAM OpenCRG.

An elevation grid requires the definition of complete squares outside the junction boundary in each direction.

The minimal elevation grid consists of four points with a z-value forming a square bounding box around the junction boundary.
This minimal elevation grid provides a plane with constant height, if the four points have the same z-value.

<a id="fig-0a196cca-883a-45aa-bae0-20cd277e1dce"></a>
![img](../_images/12_junctions/elevation_grid_minimal_points.png)

Figure 98. Example of a minimal elevation grid attached to a junction reference line

[Figure 98](#fig-0a196cca-883a-45aa-bae0-20cd277e1dce) shows a junction reference line and an elevation grid with the center points C0,0 and C1,0 on the junction reference line and the points R0,0 and R1,0 right to it.

An elevation grid consisting of more smaller squares has a higher resolution and can define more complex elevation profiles.

<a id="fig-ad06ec7e-589d-490f-82de-3a84de96960c"></a>
![img](../_images/12_junctions/elevation_grid_points.png)

Figure 99. Example of an elevation grid with more points

[Figure 99](#fig-ad06ec7e-589d-490f-82de-3a84de96960c) shows a junction reference line and an elevation grid with points to the left and right of the junction reference line.

**Elements in UML model**

**`<elevationGrid>` element**

In ASAM OpenDRIVE, elevation grids are represented by the `<elevationGrid>` element within the `<junction>` element.

```
UML class:  t_junction_elevationGrid
XML tag:    <elevationGrid> (Multiplicity: 0..1)
Introduced: 1.8.0
```

An elevation grid is a coarse square grid with z-values at evenly spaced points.
Elevation grids do not replace OpenCRG.

<a id="tab-EAID_DB19F87A_D9A6_4be1_B78B_02D6959DF29F"></a>
Table 79. Attributes of the <elevationGrid> element

| Name | Type | Use | Unit | Introduced |
| --- | --- | --- | --- | --- |
| `gridSpacing` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | 1.8.0 |
| `sStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | 1.8.0 |

**`<elevation>` element**

In ASAM OpenDRIVE, z-values at distinct points to the left or the right of the junction reference line or directly on the junction reference line are represented by `<elevation>` elements within the `<elevationGrid>` element.

```
UML class:  t_junction_elevationGrid_elevation
XML tag:    <elevation> (Multiplicity: 0..*)
Introduced: 1.8.0
```

Defines the z-values at the regular grid points along the junction reference line.

<a id="tab-EAID_68504175_190B_49f9_AC35_BFBA28C6271F"></a>
Table 80. Attributes of the <elevation> element

| Name | Type | Use | Unit | Introduced | Description |
| --- | --- | --- | --- | --- | --- |
| `center` | t\_junction\_grid\_position\_list | required | m | 1.8.0 | List of defined z-values. |
| `left` | t\_junction\_grid\_position\_list | optional | m | 1.8.0 | List of defined z-values from inside to outside. |
| `right` | t\_junction\_grid\_position\_list | optional | m | 1.8.0 | List of defined z-values from inside to outside. |

**XML example**

```
<junction>
    <elevationGrid sStart="1.35191514000e+00" gridSpacing="4.000000000e+00">
        <elevation left="5.0" center="5.0" right="5.0 5.0"/>
        <elevation left="5.0 5.0" center="5.0" right="5.0 5.0"/>
        <elevation left="5.0 5.0" center="5.0" right="5.0 5.0 5.0"/>
        <elevation left="5.0 5.0" center="5.0" right="5.0 5.0 5.0"/>
        <elevation left="5.05 5.0" center="5.1" right="5.05 5.0 5.0"/>
        <elevation left="5.1 5.0" center="5.2" right="5.1 5.0 5.0"/>
        <elevation left="5.05 5.0" center="5.1" right="5.05 5.0 5.0"/>
        <elevation left="5.0 5.0" center="5.0" right="5.0 5.0 5.0"/>
        <elevation center="5.0" right="5.0 5.0 5.0"/>
    </elevationGrid>
</junction>
```

**Rules**

The following rules apply to elevation grids:

* Elevation grids are currently only valid for common junctions.

* [asam.net:xodr:1.8.0:junctions.elevation\_grid.only\_one\_elev\_grid](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-elevation-grid-only-one-elev-grid): A junction shall have only one elevation grid.

* [asam.net:xodr:1.8.0:junctions.elevation\_grid.valid\_for\_entire\_boundry](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-elevation-grid-valid-for-entire-boundry): If a junction boundary is defined, the elevation grid shall be valid for the area enclosed by the junction boundary.

* [asam.net:xodr:1.8.0:junctions.elevation\_grid.perpendicular\_vectors](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-elevation-grid-perpendicular-vectors): The elevation grid shall be defined with vectors perpendicular to the junction reference line.

* The elevation grid shall be valid from the point where a traffic participant enters the junction boundary until it leaves the junction boundary on an outgoing road.
* The elevation grid outside the junction boundary is overwritten by a road passing the elevation grid.
  This does not apply to connecting roads, because they are inside the junction boundary.
* If an elevation grid is present it shall override any elevation values derived from any roads that are part of the junction or its boundary.
* If a lane height is present, the values are superimposed onto the grid values.

* [asam.net:xodr:1.8.0:junctions.elevation\_grid.entry\_exit\_smoothness](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-elevation-grid-entry-exit-smoothness): For junction entries and exits, a smooth transition should be assured.

**Related topics**

* [Section 12.10, "Junction boundary"](12_10_junction_boundary.html#top-6d1f0b2f-282b-4d48-a920-be13f75706a3)
* [Section 12.9, "Junction reference line"](12_09_junction_reference_line.html#top-c53f51c5-e3c1-4c7e-bc61-efdf4f0bf54c)

<a id="_interpolation_in_the_elevation_grid"></a>
### 12.11.1 Interpolation in the elevation grid

The z-values inside the junction boundary are calculated by bicubic interpolation.

<a id="fig-f498d0e0-00c7-4acb-823a-047afb594e4d"></a>
![img](../_images/12_junctions/elevation_grid_interpolation_point.png)

Figure 100. Point P in the elevation grid

[Figure 99](#fig-ad06ec7e-589d-490f-82de-3a84de96960c) shows an elevation grid with point P.

1. Identify the corner points of the square around P and the points around these corner points.  
   Square around P: C3,0, R3,0, R4,0, C4,0.  
   Points around the square: L2,0, C2,0, R2,0, R2,1, R3,1, R4,1, R5,1, R5,0, C5,0, L5,0, L4,0, L3,0.

   @@ANCHOR:fig-76305b08-726b-48ca-9dc2-2e8a1a6a23bb@@

   ![img](../_images/12_junctions/elevation_grid_interpolation_points.png)

   Figure 101. Points around P relevant for interpolations
2. Calculate the cubic polynom \(f(x) = dx^{3} + cx^{2} + bx + a\) through the points along each edge.

   Use the value `0` for the coefficients \(c\) and \(d\) of the polynoms if there are not enough support points in the elevation grid to calculate them.

   @@ANCHOR:fig-fbd2d239-0e26-4de2-b96e-9181e1bc10ea@@

   ![img](../_images/12_junctions/elevation_grid_interpolation_curves.png)

   Figure 102. Tangents and cubic splines relevant for interpolation
3. Calculate the (mixed) partial derivative of the cubic polynoms at each point in s-, t-, and st-direction.
4. Apply a bicubic interpolation using the tangents and the cubic polynoms to calculate the z-value of P.

**Calculation**

Scale and shift the points C3,0, C4,0, R3,0, R4,0 to get the normalized points \((0,0,z\_{C\_{3,0}}), (1,0,z\_{C\_{4,0}}), (0,1,z\_{R\_{3,0}}), (1,1,z\_{R\_{4,0}})\) for the calculation.

The calculation of the z-value at P uses the following parts:

1. The matrix \(Z\)

   \[\begin{align\*}
   Z=\begin{bmatrix}
   z\_{C\_{3,0}} & z\_{C\_{4,0}}\\
   z\_{R\_{3,0}} & z\_{R\_{4,0}}
   \end{bmatrix}
   \end{align\*}\]

   where

   | \(z\_{C\_{3,0}}\) | is the z-value at C3,0 |
| --- | --- |
| \(z\_{C\_{4,0}}\) | is the z-value at C4,0 |
| \(z\_{R\_{3,0}}\) | is the z-value at R3,0 |
| \(z\_{R\_{4,0}}\) | is the z-value at R4,0 |
2. The matrix \(T\_{t}\) of the tangents in t-direction:

   \[\begin{align\*}
   T\_{t}=\begin{bmatrix}
   T\_{t}(C\_{3,0}) & T\_{t}(C\_{4,0})\\
   T\_{t}(R\_{3,0}) & T\_{t}(R\_{4,0})
   \end{bmatrix}
   \end{align\*}\]
3. The matrix \(T\_{s}\) of the tangents in s-direction:

   \[\begin{align\*}
   T\_{s}=\begin{bmatrix}
   T\_{s}(C\_{3,0}) & T\_{s}(C\_{4,0})\\
   T\_{s}(R\_{3,0}) & T\_{s}(R\_{4,0})
   \end{bmatrix}
   \end{align\*}\]
4. The matrix \(T\_{st}\) of the tangents in st-direction:

   \[\begin{align\*}
   T\_{st}=\begin{bmatrix}
   T\_{st}(C\_{3,0}) & T\_{st}(C\_{4,0})\\
   T\_{st}(R\_{3,0}) & T\_{st}(R\_{4,0})
   \end{bmatrix}
   \end{align\*}\]
5. The constant matrix \(A\):

   \[\begin{align\*}
   A=\begin{bmatrix}
   1 & 0 & 0 & 0\\
   0 & 0 & 1 & 0\\
   -3 & 3 & -2 & -1\\
   2 & -2 & 1 & 1\\
   \end{bmatrix}
   \end{align\*}\]
6. The constant \(\alpha\) for the interpolation inside the same square:

   \[\begin{align\*}
   \alpha = A⋅
   \begin{bmatrix}
   Z & T\_{t}\\
   T\_{s} & T\_{st}\\
   \end{bmatrix}
   ⋅ A^{T}
   \end{align\*}\]

Scale and shift s/t coordinates of point P according to the scale and shift used for the square.

The z-value at scaled and shifted s/t coordinates calculates as:

\[\begin{align\*}
z(s,t) =
\begin{bmatrix}
1 & s & s^{2} & s^{3}
\end{bmatrix}
⋅
\alpha
⋅
\begin{bmatrix}
1 & t & t^{2} & t^{3}
\end{bmatrix}^{T}
\end{align\*}\]

**Rules**

* [asam.net:xodr:1.8.0:junctions.elevation\_grid.polynome\_coefficient\_values](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-junctions-elevation-grid-polynome-coefficient-values): The coefficients \(c\) and \(d\) of the polynoms shall be `0` if there are not enough support points in the elevation grid to calculate them.

<a id="_interpolation_between_incoming_road_and_elevation_grid"></a>
### 12.11.2 Interpolation between incoming road and elevation grid

In order to get the smoothest possible transition from an incoming road to the elevation grid of a junction, a four-sided polygon serves as transition area wherein a cubic interpolation defines the elevation values.

The four sides of the polygon are derived from the segment element with @type="joint" of the junction boundary at the incoming road and the two segment elements with @type="lane" next to it.

<a id="fig-12a2cccd-15ff-4e15-98d0-daa5563d4adb"></a>
![img](../_images/12_junctions/elevation_grid_transitionLength_points.png)

Figure 103. Three segments of a junction boundary and the corner points P0, P1, P2, and P3 of the polygon at an incoming road

The first side of the polygon corresponds to a line along the segment element with @type="joint": P0 to P1.
The second and third side of the polygon corresponds to the line between an endpoint of the first side and the point on the segment element with @type="lane" in the distance of the @transitionLength attribute of the segment element with @type="joint" along the corresponding segment element with @type="lane": P1 to P2 and P0 to P3.
The fourth side of the polygon is the line between the endpoints of the second and third sides: P2 to P3.

<a id="fig-8f040af0-5c1c-43ea-8754-dbc63c53e709"></a>
![img](../_images/12_junctions/elevation_grid_transitionLength_polygon.png)

Figure 104. Polygon and the lines AB and CD through the point P

1. Solve the following equations to calculate \(k\) and \(l\) and finally the points \(A\) and \(B\).

   \[\begin{align\*}
   A= P\_{0} + k ⋅ (P\_{1} - P\_{0})
   \end{align\*}\]

   \[\begin{align\*}
   B= P\_{3} + k ⋅ (P\_{2} - P\_{3})
   \end{align\*}\]

   \[\begin{align\*}
   P= A + l ⋅ (B - A)
   \end{align\*}\]
2. Replace \(A\) and \(B\).

   \[\begin{align\*}
   P= P\_{0} + k ⋅ (P\_{1} - P\_{0}) + l ⋅ (P\_{3} + k ⋅ (P\_{2} - P\_{3}) - (P\_{0} + k ⋅ (P\_{1} - P\_{0})))
   \end{align\*}\]

   \[\begin{align\*}
   P= P\_{0} + k ⋅ (P\_{1} - P\_{0}) + l ⋅ (P\_{3} - P\_{0}) + k ⋅ l ⋅ (P\_{2} - P\_{3} - P\_{1} + P\_{0})
   \end{align\*}\]
3. Rearrange the equation to set one side to `0`.

   \[\begin{align\*}
   k ⋅ l ⋅ (P\_{2} - P\_{3} - P\_{1} + P\_{0}) + k ⋅ (P\_{1} - P\_{0}) + l ⋅ (P\_{3} - P\_{0}) + (P\_{0} - P) = 0
   \end{align\*}\]
4. Make the following replacements to get two equations for x and y coordinates.

   \[\begin{align\*}
   \begin{matrix}
   with: & m = px\_{2} - px\_{3} - px\_{1} + px\_{0} & n = px\_{1} - px\_{0} & o = px\_{3} - px\_{0} & p = px\_{0} - px\\
   & q = py\_{2} - py\_{3} - py\_{1} + py\_{0} & r = py\_{1} - py\_{0} & s = py\_{3} - py\_{0} & t = py\_{0} - py
   \end{matrix}
   \end{align\*}\]

   Result:

   \[\begin{align\*}
   \begin{matrix}
   f\_{x}(k, l) & := & m ⋅ k ⋅ l & + & n ⋅ k & + & o ⋅ l & + & p & = & 0\\
   f\_{y}(k, l) & := & q ⋅ k ⋅ l & + & r ⋅ k & + & s ⋅ l & + & t & = & 0
   \end{matrix}
   \end{align\*}\]
5. Solve the equations for the variables \(k\) and \(l\).
6. Calculate the points \(A\) and \(B\).
   For point \(A\), the \(z\_{A}\) value and the gradient \(m\_{A}\) are calculated at the end of the incoming road.
   For point \(B\), the \(z\_{B}\) value and the gradient \(m\_{A}\) in the direction of vector \(AB\) are calculated from the elevation grid.
7. Normalize the gradients \(m\_{A}\) and \(m\_{B}\) by dividing them by the length of vector \(AB\).
8. Calculate the coefficients for a cubic interpolation.

   \[\begin{align\*}
   \begin{matrix}
   a = & z\_{A}\\
   b = & & & & & m\_{A}\\
   c = & -3 ⋅ z\_{A} & + & 3 ⋅ z\_{B} & - & 2 ⋅ m\_{A} & - & m\_{B}\\
   d = & 2 ⋅ z\_{A} & - & 2 ⋅ z\_{B} & + & m\_{A} & + & m\_{B}
   \end{matrix}
   \end{align\*}\]
9. Calculate \(z\) at point \(P\).

   \[\begin{align\*}
   \begin{matrix}
   z\_{P} (l) = a + b ⋅ l + c ⋅ l^{2} + d ⋅ l^{3} & with & l = [0..1]
   \end{matrix}
   \end{align\*}\]

## 12.12 Junction CRG surface

In order to describe complex elevations within a junction on a very detailed level, a surface description for junctions can be specified.
This is accomplished by describing the junction surface in correspondence with the descriptions used in ASAM OpenCRG.
For junctions that are not flat but without a very detailed surface description, the `<elevationGrid>` should be used.

The CRG data may be applied to a given junction in different modes similar to a road, using the junction reference line specified by the `<planview>` element.

<a id="tab-8dd4bfa6-b06a-48be-8044-07887e2e811a"></a>
Table 81. Modes of connecting ASAM OpenCRG to ASAM OpenDRIVE

| Mode | ASAM OpenCRG reference line | Total height | Typical use case |
| --- | --- | --- | --- |
| attached | discarded | ASAM OpenDRIVE junction height plus ASAM OpenCRG height | Relative road height to road surface (including interpolated elevation grid and lane height) |
| attached0 | discarded | ASAM OpenCRG height only | Absolute height measurement |
| genuine | shifted and rotated so beginning of ASAM OpenCRG reference line matches position on junction reference line given in ASAM OpenDRIVE | ASAM OpenCRG height only | Combining complete ASAM OpenCRG tracks (for example, junction surface measurement) with ASAM OpenDRIVE data |
| global | taken unmodified | ASAM OpenCRG height only | On junctions |

|  | For a detailed explanation of the different modes, see [Section 10.6, "Road CRG surface"](../10_roads/10_06_road_surface.html#top-7a0a2c4b-41a6-46e6-845e-932f2a014730). Instead of a road reference line use the junction reference line to place CRG data on the junction surface. |
| --- | --- |
|  |  |

**Elements in UML model**

**`<surface>` element**

In ASAM OpenDRIVE, surfaces in a junction are represented by the `<surface>` element within the `<junction>` element and use the same information as the `<road>` element.

```
UML class: t_road_surface
XML tag:   <surface> (Multiplicity: 0..1)
```

Contains a series of elements describing a surface.

**`<CRG>` element**

In ASAM OpenDRIVE, ASAM OpenCRG data of road surfaces is represented by the `<CRG>` element within the `<surface>` element.

```
UML class: t_road_surface_CRG
XML tag:   <CRG> (Multiplicity: 0..*)
```

Links road surface data defined according to ASAM OpenCRG format.

<a id="tab-EAID_B47DD743_6B99_49c9_A696_5688C475AD49"></a>
Table 82. Attributes of the <CRG> element

| Name | Type | Use | Unit | Description |
| --- | --- | --- | --- | --- |
| `file` | string | required |  | Name of the file containing the CRG data |
| `hOffset` | double | optional | rad | Heading offset between CRG center line and reference line of the road (only allowed for mode genuine, default = 0.0). |
| `mode` | [e\_road\_surface\_CRG\_mode](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_A6071BD4_9A19_4bd9_9DCA_2EF127ED6D8F) | required |  | Attachment mode for the surface data, see specification. |
| `orientation` | [e\_direction](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EE7BA5A8_72F5_411a_AD27_89495B78140C) | required |  | Orientation of the CRG data set relative to the parent `<road>` element. Only allowed for mode attached and attached0. |
| `purpose` | [e\_road\_surface\_CRG\_purpose](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_4555C4E5_3092_4672_9948_5E3A41CB86DD) | optional |  | Physical purpose of the data contained in the CRG file; if the attribute is missing, data will be interpreted as elevation data. |
| `sEnd` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | End of the application of CRG (s-coordinate) |
| `sOffset` | double | optional | m | s-offset between CRG center line and reference line of the road (default = 0.0) |
| `sStart` | [t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D) | required | m | Start of the application of CRG data (s-coordinate) |
| `tOffset` | double | optional | m | t-offset between CRG center line and reference line of the road (default = 0.0) |
| `zOffset` | double | optional | m | z-offset between CRG center line and reference line of the road (default = 0.0). Only allowed for purpose elevation. |
| `zScale` | double | optional |  | z-scale factor for the surface description (default = 1.0). Only allowed for purpose elevation. |

**Rules**

The following rules apply to junction CRG surfaces:

* Junction CRG surfaces shall use the junction reference line.
* When a `<junction>` element contains a `<surface>` element, the `<surface>` element supersedes all elevation data for connecting roads.

**Related topics**

* [Section 10.6, "Road CRG surface"](../10_roads/10_06_road_surface.html#top-7a0a2c4b-41a6-46e6-845e-932f2a014730)
* [Section 12.9, "Junction reference line"](12_09_junction_reference_line.html#top-c53f51c5-e3c1-4c7e-bc61-efdf4f0bf54c)
* [Section 12.11, "Junction elevation grid"](12_11_junction_elevation_grid.html#top-26a9b5c3-a1f1-4958-b8da-4ce704ae96fc)

## 12.13 Junction groups

Two or more junctions may be grouped in junction groups to indicate that these junctions belong to the same roundabout.

<a id="fig-7046a7a4-6998-4cee-a8f6-02af371b9b23"></a>
![img](../_images/12_junctions/junction_5.png)

Figure 105. Junction group with three junctions

[Figure 105](#fig-7046a7a4-6998-4cee-a8f6-02af371b9b23) shows how the junctions `1`, `2` and `3` are aggregated in junction group `A`.

Junction groups are described by `<junctionGroup>` elements.
The junctions that belong to the junction group are specified by `<junctionReference>` elements.

**Elements in UML model**

**`<junctionGroup>` element**

In ASAM OpenDRIVE, junction groups are represented by the `<junctionGroup>` element within the `<OpenDRIVE>` element.

```
UML class: t_junctionGroup
XML tag:   <junctionGroup> (Multiplicity: 0..*)
```

Junction groups indicate for routing that the grouped junctions belong to the same node and are commonly seen as one big junction, for example roundabouts or highway interchanges.

The `<junctionGroup>` element is split into a header element and a series of member elements.

<a id="tab-EAID_3D09D7E9_9971_43a8_BAE0_A7088A915318"></a>
Table 83. Attributes of the <junctionGroup> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `id` | string | required | Unique ID within database |
| `name` | string | optional | Name of the junction group. May be chosen freely. |
| `type` | [e\_junctionGroup\_type](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_CE087C97_2B93_4646_83F9_DF84FE2DBE8C) | required | Type of junction group |

<a id="fig-31ea1f61-71ea-4db1-abc3-6bc684537a29"></a>
![img](../_images/uml_class_diagrams/EAID_C4CFB1D1_8463_420e_BB7B_BBC1449CFAB7.png)

Figure 106. UML class diagram of the JunctionGroup class

[Figure 106](#fig-31ea1f61-71ea-4db1-abc3-6bc684537a29) shows the UML class diagram of the ASAM OpenDRIVE JunctionGroup class.

**`<junctionReference>` element**

In ASAM OpenDRIVE, references to junctions are represented by the `<junctionReference>` element within the `<junctionGroup>` element.

```
UML class: t_junctionGroup_junctionReference
XML tag:   <junctionReference> (Multiplicity: 1..*)
```

References to existing `<junction>` elements.

<a id="tab-EAID_3EEBD1CF_47A9_4733_82CF_6F21DD9BC744"></a>
Table 84. Attributes of the <junctionReference> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `junction` | string | required | ID of the junction |

**XML example**

* [UC\_2Lane-RoundAbout-3Arms.xodr](../_attachments/use_cases/UC_2Lane-RoundAbout-3Arms/UC_2Lane-RoundAbout-3Arms.xodr)

**Related topics**

* [Section 12.1, "Introduction to junctions"](12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)
* [Section 12.14, "Signal synchronization groups in junctions"](12_14_signal_synchronization_groups.html#top-add49732-8747-40b6-93b0-1b3ff20afeb9)

## 12.14 Signal synchronization groups in junctions

Multiple signal groups can be mapped to a signal synchronization group that consists of a list of signal controllers in a junction which can be synchronized (see  [Section 14.6, "Signal Controllers"](../14_signals/14_06_controllers.html#top-bb3b8324-47ba-4c80-aee7-a4a443cd0ef3)).
This mapping can be used for example in case an ASAM OpenSCENARIO `TrafficSignalControllerAction` is setting the semantic state for one signal group and afterwards syncing all other signal groups of that particular signal synchronization group to switch to the matching phase in their signal cycle.
For detailed definitions of terms specific to dynamic signals see  [Annex C, *Terms for dynamic signals (normative)*](../16_annexes/terms/top_ter_dynamic_signals.html#top-7028394a-a7a3-439b-8bc9-dbbd1b8506c8).
In future it might be beneficial to extend this to junction groups or to a more generic approach matching the synchronization group definition.

<a id="fig-b13ae64c-fb46-4223-bbae-645a0ecfad9a"></a>
![img](../_images/00_images_reused/fig_junction.drawio.svg)

Figure 107. Example of a junction with 20 traffic lights mapped into six signal groups (IDs 42-47)

[Figure 107](#fig-b13ae64c-fb46-4223-bbae-645a0ecfad9a) shows a junction with 20 traffic lights mapped into six signal groups.
If controller ID `46` switches the signals in this signal group to semantic state `go`, one would like to automatically set all other signals within the junction to a matching phase according to their signal cycle.
For example signals controlled by controller ID `44` should be switched to semantic state `stop`.

Junction controllers are used to map signal groups respectively the controllers controlling the signal groups into a synchronization group within one junction.
A junction controller is described by `<controller>` elements within the `<junction>` element.

The @type attribute of control depends on the application and is not specified in ASAM OpenDRIVE.

**Elements in UML model**

**`<controller>` element**

In ASAM OpenDRIVE, controllers are represented by the `<controller>` element within the `<junction>` element.

```
UML class: t_junction_controller
XML tag:   <controller> (Multiplicity: 0..*)
```

Lists the controllers that should be grouped in a sychronization group (limited to that particular junction).

<a id="tab-EAID_BBED8697_3D66_4898_81BB_18CF060A336F"></a>
Table 85. Attributes of the <controller> element

| Name | Type | Use | Description |
| --- | --- | --- | --- |
| `id` | string | required | ID of the controller |
| `sequence` | nonNegativeInteger | optional | Sequence number (priority) of this controller with respect to other controllers in the same junction |
| `type` | string | optional | Type of control for this junction. Free text, depending on the application. |

**XML example**

* [UC\_Simple-X-Junction-TrafficLights.xodr](../_attachments/use_cases/UC_Simple-X-Junction-TrafficLights/UC_Simple-X-Junction-TrafficLights.xodr)

**Related topics**

* [Section 12.1, "Introduction to junctions"](12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)
* [Section 12.13, "Junction groups"](12_13_junction_groups.html#top-99e6f0a6-ad6b-4c5e-bace-622208adfc2f)
* [Section 14.6, "Signal Controllers"](../14_signals/14_06_controllers.html#top-bb3b8324-47ba-4c80-aee7-a4a443cd0ef3)
