> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 14 Signals

## 14.1 Introduction to signals

Signals are traffic signs, traffic lights, and specific road marking for the control and regulation of road traffic.

![img](../_images/14_signals/Signals_1.png)

Figure 124. Signals in ASAM OpenDRIVE

[Figure 124](#fig-6c4bd93c-5103-4335-9005-24153acfb62d) shows exemplary signal definitions for ASAM OpenDRIVE.

Signals have different functions and properties:

*   They are used to control traffic behavior, for example, with speed limits and turn restrictions, and to alert road traffic about dangerous situations.
    
*   They can be static or dynamic. Static signals, such as stop signs, do not change their meaning. Dynamic signals, like traffic lights or variable message boards, may change their meaning during the simulation. Their dynamic content may be defined in ASAM OpenSCENARIO.

Signals shall be placed in relation to a specific road. The position of the signal is described relative to the road reference line, using the s- and t- coordinates. Signals shall be positioned in such a way that it is clear to which road or lane they belong and where their validity starts. Ambiguity about their interpretation shall be avoided.

Traffic rules are different for each country. The country of the signal is specified in the @country attribute. When placing signals in ASAM OpenDRIVE, country-specific legislation and traffic rules should be considered. Legislative changes are indicated by the year when the rules come into force. Traffic rules for the entire ASAM OpenDRIVE file can be defined in the `<defaultRegulations>` element in the `<header>` element.

The @height and @width attributes of a signal are not required but are recommended for proper representation of the signal. The @length attribute can be used to specify a thickness of the signal.

Road marks, that are not binding to traffic, are not defined as signals, but only as objects.

A signal with the @type and @subtype attributes is only unique in combination with the @country and @countryRevision attributes. Since some elements that are considered signals in ASAM OpenDRIVE, for example traffic lights, do not have any official @type and @subtype representation, these are specified in the [Signal reference 1.0.0](../../../../ASAM_OpenDRIVE_Signal_reference/latest/signal-catalog/index.html) . They can be used with the appropriate @type, @subtype and the @country="OpenDRIVE".

![img](../_images/14_signals/Signals_2.png)

Figure 125. Width and height for signal

[Figure 125](#fig-b5c4caf3-1266-41c7-bb3b-ff746fb8295e) shows the attributes ASAM OpenDRIVE provides for a speed regulation signal. It is pointed out how height and width are measured.

A signal with an @orientation of `+` applies to traffic traveling in the positive road reference line direction. This means the signal with an @hOffset of `0` faces to the drivers traveling in a positive road reference line direction. Any @hOffset given to this signal is applied counter-clockwise from the negative road reference line direction.

A signal with an @orientation of `-` applies to traffic traveling in the negative road reference line direction. This means the signal with an @hOffset of `0` faces to the drivers traveling in the negative road reference line direction. Any @hOffset given to this signal is applied counter-clockwise from the positive road reference line direction.

![img](../_images/14_signals/Signals_7.png)

Figure 126. Orientation and hOffset for signal

[Figure 126](#fig-27a17ba9-f404-41e1-975b-bd7116d277c7) shows a signal which applies to traffic traveling in the positive road reference line direction and which is turned counter-clockwise from the negative road reference line direction. For the `<signal>` element, the @orientation attribute and @hOffset attribute are defined. To the @orientation attribute the `+` value is assigned and to the @hOffset attribute a value of `5.7595865` is assigned.

**Elements in UML model**

**`<signals>` element**

In ASAM OpenDRIVE, signals are represented by the `<signals>` element within the `<road>` element.

UML class: t\_road\_signals
XML tag:   <signals> (Multiplicity: 0..1)

Signals are traffic signs, traffic lights, and specific road markings for the control and regulation of road traffic.

The `<signals>` element is the container for all signals along a road.

![img](../_images/uml_class_diagrams/EAID_811E8671_D70D_4491_BCD2_F2DC1CDF8E17.png)

Figure 127. UML class diagram of the Signals class

[Figure 127](#fig-d8de1313-7b9a-4fac-b76f-4a60c8194997) shows the UML class diagram of the ASAM OpenDRIVE Signals class.

**`<signal>` element**

In ASAM OpenDRIVE, a signal is represented by the `<signal>` element within the `<signals>` element.

UML class: t\_road\_signals\_signal\_road
XML tag:   <signal> (Multiplicity: 0..\*)

Used to provide information about signals along a road. Consists of a main element and an optional lane validity element. The element for a signal is `<signal>`.

Table 120. Attributes of the <signal> element

Name

Type

Use

Unit

Introduced

Description

`countryRevision`

string

optional

Defines the year of the applied traffic rules

`country`

[e\_countryCode](../16_annexes/map_uml_data_types.html#top-EAID_7A0922E5_0B9A_4a52_8063_A2499579DB20)

optional

Country code of the road, see ISO 3166-1, alpha-2 codes.

`dynamic`

[t\_yesNo](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_A171A2AA_DFE6_4b8b_BA5A_AD59E6334468)

required

Indicates whether the signal is dynamic or static. Example: traffic light is dynamic

`hOffset`

double

optional

rad

Heading offset of the signal (relative to @orientation, if orientation is equal to “+” or “-“)
Heading offset of the signal (relative to road reference line, if orientation is equal to “none” )

`height`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

Height of the signal, measured from bottom edge of the signal.

`id`

string

required

Unique ID of the signal within the OpenDRIVE file

`length`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

1.8.0

Length of the signal’s bounding box.
@length is defined in the local coordinate system u/v along the u-axis

`name`

string

optional

Name of the signal. May be chosen freely.

`orientation`

[e\_orientation](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D8972119_8CE4_407e_A4AD_3183B0B5C687)

required

"+" = valid in positive s- direction
"-" = valid in negative s- direction
"none" = valid in both directions

`pitch`

double

optional

rad

Pitch angle of the signal, relative to the inertial system (xy-plane)

`roll`

double

optional

rad

Roll angle of the signal after applying pitch, relative to the inertial system (x’’y’’-plane)

`s`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate

`subtype`

string

required

Subtype identifier according to country code or "-1" / "none"

`t`

double

required

m

t-coordinate

`text`

string

optional

Additional text associated with the signal, for example, text on city limit "City\\nBadAibling"

`type`

string

required

Type identifier according to country code
or "-1" / "none". See extra document.

`unit`

[e\_unit](../16_annexes/map_uml_data_types.html#top-EAID_34376D30_4A82_46e3_9ADC_BCD136B920FF)

optional

Unit of @value

`value`

double

optional

Value of the signal, if value is given, unit is mandatory

`width`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

Width of the signal’s bounding box.
@width is defined in the local coordinate system u/v along the v-axis

`zOffset`

double

required

m

z-offset of signal’s origin relative to the elevation of the road reference line

**XML example**

```
<signals>
    <signal s="3981.4158159146"
            t="-14.0503"
            id="5000162"
            name="Vorschriftzeichen"
            dynamic="no"
            orientation="+"
            zOffset="3.8835"
            country="DE"
            countryRevision="2017"
            type="274"
            subtype="100"
            value="100"
            unit="km/h"
            height="0.77"
            width="0.77"
            hOffset="5.7595865">
    </signal>
</signals>
```

**Rules**

The following rules apply to signals:

*   [asam.net:xodr:1.7.0:road.signal.signal\_type](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-signal-type): Signals shall have a specific type and subtype.
    
*   [asam.net:xodr:1.7.0:road.signal.priority](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-priority): If present, signals shall be used in priority to other traffic rules.
    
*   [asam.net:xodr:1.7.0:road.signal.use\_country\_code](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-use-country-code): A country code shall be added to refer to country-specific rules using the @country attribute.
    
*   The year the traffic rules come into force may be specified in the @countryRevision attribute.
    
*   Signals may be valid for one direction or both directions.
    
*   Signals may be dynamic or static.

**Related topics**

*   [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)
    
*   [Section 14.6, "Signal Controllers"](14_06_controllers.html#top-bb3b8324-47ba-4c80-aee7-a4a443cd0ef3)

## 14.2 Lane validity for signals

By default, signals are valid for all lanes of a road, for traffic traveling in the direction indicated by @orientation attribute of a `<signal>` element. Lane validity offers the possibility to restrict the validity of a signal to specific lanes only by using a `<validity>` element.

![img](../_images/14_signals/Signals_3.png)

Figure 128. Lanes with signals in the shape of road marks

[Figure 128](#fig-da6d3888-b77e-4fdc-a9ad-9e53f36eeb3c) shows how signals in the shape of a road mark specify the speed limit of different lanes.

The @orientation attribute and `<validity>` element complement each other. The @orientation attribute and the `<validity>` element are not interchangeable.

*   The @orientation attribute defines the travel direction for which a signal is valid.
    
*   The `<validity>` element defines the lanes for which a signal is valid.

As an example for the difference in using the attribute and the element, speed limits can be taken: if traveling in road reference line direction, with right-hand-traffic, then a speed limit signal with `orientation="+"` applies to a vehicle even if this vehicle is driving on an oncoming lane while overtaking. If the validity is limited to all right lanes then the signal does not apply, however, to the vehicle while it is in an oncoming lane. Therefore, the `<validity>` element should only be used to limit signals to specific lanes, for example for traffic lights which only apply to certain lanes.

**Elements in UML model**

**`<validity>` element**

In ASAM OpenDRIVE, lane validity is represented by the `<validity>` element within the `<signal>` or `<signalReference>` element.

UML class: t\_road\_objects\_object\_laneValidity
XML tag:   <validity> (Multiplicity: 0..\*)

Lane validities restrict signals and objects to specific lanes.

Table 121. Attributes of the <validity> element

Name

Type

Use

Description

`fromLane`

integer

required

Minimum ID of the lanes for which the object is valid

`toLane`

integer

required

Maximum ID of the lanes for which the object is valid

**Rules**

The following rules apply to validity elements:

*   A signal may be valid for one or more lanes.
    
*   The range given by all `<validity>` elements shall be a subset of the parent’s @orientation attribute:
    
*   [asam.net:xodr:1.7.0:road.signal.validty.right\_hand\_traffic\_lane\_ids](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-validty-right-hand-traffic-lane-ids): For right-hand traffic, @orientation="+" implies that the `<validity>` element shall only span negative lane ids, while @orientation="-" implies that the `<validity>` element shall only span positive lane ids. If the given `<validity>` elements span both, positive and negative lane ids, @orientation="none" shall be used.
    
*   [asam.net:xodr:1.7.0:road.signal.validty.left\_hand\_traffic\_lane\_ids](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-validty-left-hand-traffic-lane-ids): For left-hand-traffic, @orientation="-" implies that the `<validity>` element shall only span negative lane ids, while @orientation="+" implies that the `<validity>` element shall only span positive lane ids. If the given `<validity>` elements span both, positive and negative lane ids, @orientation="none" shall be used.
    
*   The value of the @fromLane attribute shall be lower than or equal to the value of the @toLane attribute.

**Related topics**

*   [Section 14.1, "Introduction to signals"](14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)
    
*   [Section 14.3, "Signal dependency"](14_03_signal_dependency.html#top-f4d8bdcc-3f58-454d-b14e-801a880d9c41)

## 14.3 Signal dependency

Signal dependency means that one signal controls the output of another signal.

**Elements in UML model**

**`<dependency>` element**

In ASAM OpenDRIVE, signal dependency is represented by the `<dependency>` element within the `<signal>` element.

UML class: t\_road\_signals\_signal\_dependency
XML tag:   <dependency> (Multiplicity: 0..\*)

Signal dependencies limit or extend the validity of one signal by an additional signal. For example, a speed limit sign of 60 km/h that is only valid for trucks, specified by a supplementary sign. One signal may have multiple dependencies.

Table 122. Attributes of the <dependency> element

Name

Type

Use

Description

`id`

string

required

ID of the controlling signal

`type`

string

optional

Type of the dependency,
Free text, depending on application

**XML example**

![img](../_images/14_signals/Signals_4.png)

Figure 129. Lane and type specific speed limit

[Figure 129](#fig-1ad6881b-550a-4505-9ee1-52ae5fbcf7bb) shows the dependency between the speed limit signal and the signal to make the lane valid for specific traffic participants only.

```
<signals>
    <signal s="50.0"
            t="-4.0"
            id="1"
            name="SpeedLimit60"
            dynamic="no"
            orientation="+"
            zOffset="1.90"
            type="274"
            country="DE"
            countryRevision="2013"
            subtype="56"
            value="60.0"
            unit="km/h"
            hOffset="0.0 "
            pitch="0.0"
            roll="0.0"
            height="0.61"
            width="0.61">
        <dependency id="2"/>
    </signal>
    <signal s="50.0"
            t="-4.0"
            id="2"
            name="LorriesOnly"
            dynamic="no"
            orientation="+"
            zOffset="1.56"
            type="1048"
            country="DE"
            countryRevision="2013"
            subtype="12"
            hOffset="0.0"
            pitch="0.0"
            roll="0.0"
            height="0.33"
            width="0.60">
    </signal>
</signals>
```

**Rules**

The following rules apply to dependency elements:

*   [asam.net:xodr:1.7.0:road.signal.dependency.multiple\_dependency](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-dependency-multiple-dependency): A signal may have multiple dependencies.
    
*   The type of dependency is not specifically defined in ASAM OpenDRIVE and may be set in the application.

Rules regarding the type of dependency are defined in the application and are not stored in ASAM OpenDRIVE.

**Related topics**

*   [Section 14.1, "Introduction to signals"](14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)
    
*   [Section 14.4, "Signal reference"](14_04_signal_reference.html#top-1030e9ff-6b75-4353-b2b4-043f08c02a2d)

## 14.4 Signal reference

Signal reference means that there is some kind of link between two signals or objects. A signal reference is valid for one specific signal only.

**Elements in UML model**

**`<reference>` element**

In ASAM OpenDRIVE, a signal reference is represented by the `<reference>` element within the `<signal>` element.

UML class: t\_road\_signals\_signal\_reference
XML tag:   <reference> (Multiplicity: 0..\*)

Signal references link a signal to another signal or object. One signal may have multiple signal references. The signal reference term should not to be confused with the `<signalReference>` element that is used to link a signal to multiple roads.

Table 123. Attributes of the <reference> element

Name

Type

Use

Description

`elementId`

string

required

Unique ID of the linked element

`elementType`

[e\_road\_signals\_signal\_reference\_elementType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_719D83FA_FFE4_42e5_A475_7D5EEE7035BC)

required

Type of the linked element

`type`

string

optional

Type of the linkage
Free text, depending on application

**XML example**

An example would be a traffic light which uses a `<reference>` to a stop line in order to specify where traffic participants have to stop on red. The stop line in turn has a `<dependency>` on the traffic light, since traffic should stop there only if the traffic light is red.

```
<signals>
    <signal s="1.0e+00"
            t="-1.0e-01"
            id="5"
            name="pedestrian_trafficlight"
            dynamic="yes"
            orientation="+"
            zOffset="3.03"
            type="1000002"
            subtype="-1"
            country="OpenDRIVE"
            countryRevision="2023"
            hOffset="0.0"
            pitch="0.0"
            roll="0.0"
            height="0.53"
            width="0.27">
        <validity fromLane="-1" toLane="-1"/>
        <reference elementId="7" elementType="signal" type="stopline"/>
    </signal>
    <signal s="1.31e+01"
            t="0.0"
            id="7"
            name="InvisibleStopLine"
            dynamic="no"
            orientation="-"
            zOffset="0.0"
            type="1100001"
            subtype="-1"
            country="OpenDRIVE"
            countryRevision="2023"
            hOffset="0.0"
            pitch="0.0"
            roll="0.0"
            height="0.03"
            width="3.75">
        <validity fromLane="-1" toLane="-1"/>
        <dependency id="5" type="pedestrian_trafficlight"/>
    </signal>
</signals>
```

**Rules**

The following rules apply to signal reference elements:

*   A signal may have multiple references.
    
*   The type of reference is not specifically defined in ASAM OpenDRIVE and may be set in the application.

Rules regarding the type of reference are defined in the application and are not stored in ASAM OpenDRIVE.

**Related topics**

*   [Section 13.1, "Introduction to objects"](../13_objects/13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)
    
*   [Section 14.1, "Introduction to signals"](14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)
    
*   [Section 14.3, "Signal dependency"](14_03_signal_dependency.html#top-f4d8bdcc-3f58-454d-b14e-801a880d9c41)

## 14.5 Multiple roads

ASAM OpenDRIVE offers the possibility for one signal to apply to multiple roads. This is achieved by defining the signal in one road using a `<signal>` element, and referencing it from one or more other roads using `<signalReference>` elements. This is especially useful in junctions where many roads are close together and, for example, speed limit signs may need to apply to more than one of those close-together roads.

The `<signalReference>` element shall include the longitudinal, @s attribute, and lateral, @t attribute, position on the road where the referenced signal should take effect. The `<signalReference>` element shall also include an @orientation attribute to specify whether the referenced signal applies to traffic flowing in the positive, negative, or both s-directions. Similarly to `<signal>` elements themselves, `<signalReference>` elements may be supplemented with an `<validity>` element for lane validity. This makes it possible to include or exclude certain lanes from the signal’s validity range.

**Elements in UML model**

**`<signalReference>` element**

In ASAM OpenDRIVE, a referenced signal is represented by the `<signalReference>` element within the `<signals>` element.

UML class: t\_road\_signals\_signalReference
XML tag:   <signalReference> (Multiplicity: 0..\*)

Refers to the same, that is, identical signal from multiple roads. The referenced signals require a unique ID. The `<signalReference>` element consists of a main element and an optional lane validity element.

Table 124. Attributes of the <signalReference> element

Name

Type

Use

Unit

Description

`id`

string

required

Unique ID of the referenced signal within the database

`orientation`

[e\_orientation](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D8972119_8CE4_407e_A4AD_3183B0B5C687)

required

"+" = valid in positive s-direction
"-" = valid in negative s-direction
"none" = valid in both directions

`s`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate

`t`

double

required

m

t-coordinate

![img](../_images/14_signals/fig_uml_class_signals_signalreference.png)

Figure 130. UML model of the t\_road\_signals\_signalReference element in the Signals class

[Figure 130](#fig-5135d59a-7c1f-44f2-98e2-06131929e846) shows the UML model of the t\_road\_signals\_signalReference element in the ASAM OpenDRIVE Signals class.

**`<validity>` element**

In ASAM OpenDRIVE, lane validity is represented by the `<validity>` element within the `<signal>` or `<signalReference>` element.

UML class: t\_road\_objects\_object\_laneValidity
XML tag:   <validity> (Multiplicity: 0..\*)

Lane validities restrict signals and objects to specific lanes.

Table 125. Attributes of the <validity> element

Name

Type

Use

Description

`fromLane`

integer

required

Minimum ID of the lanes for which the object is valid

`toLane`

integer

required

Maximum ID of the lanes for which the object is valid

**XML example**

*   [UC\_X\_Junction.xodr](../_attachments/use_cases/UC_Junction/UC_X_Junction.xodr)

**Rules**

The following rules apply to referencing signals from multiple roads using the `<signalReference>` element:

*   A lane `<validity>` element may be added for every `<signalReference>` element.
    
*   [asam.net:xodr:1.7.0:road.signal.reference.used\_for\_signals\_only](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-reference-used-for-signals-only): Signal reference shall be used for signals only.
    
*   [asam.net:xodr:1.7.0:road.signal.reference.specify\_direction](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-reference-specify-direction): The direction on the road for which the referenced signal is valid shall be specified for every `<signalReference>` element using the @orientation attribute.
    
*   The range given by all `<validity>` elements shall be a subset of the parent’s @orientation attribute: include::partial$rules/road/signal/reference/right\_hand\_traffic\_lane\_ids.adoc[\].
    
*   [asam.net:xodr:1.7.0:road.signal.reference.left\_hand\_traffic\_lane\_ids](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-reference-left-hand-traffic-lane-ids): For left-hand-traffic, @orientation="-" implies that the `<validity>` element shall only span negative lane ids, while @orientation="+" implies that the `<validity>` element shall only span positive lane ids. If the given `<validity>` elements span both, positive and negative lane ids, @orientation="none" shall be used.
    
*   [asam.net:xodr:1.7.0:road.signal.reference.from\_lower\_equal\_to](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-reference-from-lower-equal-to): The value of the @fromLane attribute shall be lower than or equal to the value of the @toLane attribute.

**Related topics**

*   [Section 14.1, "Introduction to signals"](14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)
    
*   [Section 14.2, "Lane validity for signals"](14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)

## 14.6 Signal Controllers

A signal controller applies a signal cycle to a signal group. The mapping of dynamic signals to a signal group is done in `<controller>`. The ID of the referenced signal is stored in the `<control>` element within the `<controller>` element. Unlike signal dependency, signal controllers are high-level elements that do not depend on other signals.

Dynamic content like the signal cycle itself is specified outside of this standard, for example, in ASAM OpenSCENARIO. For detailed definitions of terms specific to dynamic signals see [Annex C, _Terms for dynamic signals (normative)_](../16_annexes/terms/top_ter_dynamic_signals.html#top-7028394a-a7a3-439b-8bc9-dbbd1b8506c8).

![img](../_images/00_images_reused/fig_junction.drawio.svg)

Figure 131. Example of a junction with 20 traffic lights mapped into six signal groups (IDs 42-47)

[Figure 131](#fig-2bb60c87-ffac-4a05-b217-42541fffe1bf) shows an example of an X-Junction with six traffic signals for vehicles, six traffic signals for trams, and eight traffic signals for pedestrians. These are grouped into six signal groups that are controlled by controller with ID `42` to `47`.

![img](../_images/14_signals/fig_signal_program.svg)

Figure 132. Example of a signal program that defines the signal cycles for the signal groups

[Figure 132](#fig-df589d01-586d-422f-9bf6-04f135d65ced) shows an example of an appropriate signal program for signals controlled by controller with ID `42` and `44`.

**Elements in UML model**

**`<controller>` element**

In ASAM OpenDRIVE, controllers are represented by the `<controller>` element within the `<OpenDRIVE>` element.

UML class: t\_controller
XML tag:   <controller> (Multiplicity: 0..\*)

Controllers provide a signal program for a traffic signal or a signal group. The mapping of traffic signals to a signal group is done in t\_controller. Dynamic content like the signal program itself is specified outside of this standard (i.e. in OpenSCENARIO).

Table 126. Attributes of the <controller> element

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

Name of the controller. May be chosen freely.

`sequence`

nonNegativeInteger

optional

Sequence number (priority) of this controller with respect to other controllers of same logical level

![img](../_images/uml_class_diagrams/EAID_B88092E5_0933_4514_984D_54D2E961692B.png)

Figure 133. UML class diagram of the Controller class

[Figure 133](#fig-c538a48d-acd0-4012-8d59-47108f27b8b4) shows the UML class diagram of the ASAM OpenDRIVE Controller class.

**`<control>` element**

In ASAM OpenDRIVE, controlled signals are represented by the `<control>` element within the `<controller>` element.

UML class: t\_controller\_control
XML tag:   <control> (Multiplicity: 1..\*)

Provides information about a single signal within a signal group controlled by the corresponding controller.

Table 127. Attributes of the <control> element

Name

Type

Use

Description

`signalId`

string

required

ID of the controlled signal

`type`

string

optional

Type of control.
Free Text, depends on the application.

**XML example**

*   [UC\_Simple-X-Junction-TrafficLights.xodr](../_attachments/use_cases/UC_Simple-X-Junction-TrafficLights/UC_Simple-X-Junction-TrafficLights.xodr)

**Rules**

The following rules apply to controllers:

*   [asam.net:xodr:1.7.0:road.signal.controller.valid\_for\_signals](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-signal-controller-valid-for-signals): Controllers shall be valid for one or more signals.

**Related topics**

*   [Section 14.1, "Introduction to signals"](14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)
    
*   [Section 14.3, "Signal dependency"](14_03_signal_dependency.html#top-f4d8bdcc-3f58-454d-b14e-801a880d9c41)
    
*   [Section 12.14, "Signal synchronization groups in junctions"](../12_junctions/12_14_signal_synchronization_groups.html#top-add49732-8747-40b6-93b0-1b3ff20afeb9)

## 14.7 Signal boards

**Elements in UML model**

**`<staticBoard>` element**

UML class:  t\_road\_signals\_staticBoard
XML tag:    <staticBoard> (Multiplicity: 0..\*)
Introduced: 1.8.0

A `<signal>` element that contains a `<staticBoard>` element. The signs that are displayed on a static board are defined as separate `<sign>` elements.

**`<sign>` element**

UML class:  t\_road\_signals\_board\_sign
XML tag:    <sign> (Multiplicity: 0..\*)
Introduced: 1.8.0

A `<sign>` element on a static board defined in the local coordinate system of the `<signal>` element. A `<sign>` element may have all attributes and child elements of a signal.

Table 128. Attributes of the <sign> element

Name

Type

Use

Unit

Introduced

Description

`countryRevision`

string

optional

Defines the year of the applied traffic rules

`country`

[e\_countryCode](../16_annexes/map_uml_data_types.html#top-EAID_7A0922E5_0B9A_4a52_8063_A2499579DB20)

optional

Country code of the road, see ISO 3166-1, alpha-2 codes.

`dynamic`

[t\_yesNo](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_A171A2AA_DFE6_4b8b_BA5A_AD59E6334468)

required

Indicates whether the signal is dynamic or static. Example: traffic light is dynamic

`hOffset`

double

optional

rad

Heading offset of the signal (relative to @orientation, if orientation is equal to “+” or “-“)
Heading offset of the signal (relative to road reference line, if orientation is equal to “none” )

`height`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

Height of the signal, measured from bottom edge of the signal.

`id`

string

required

Unique ID of the signal within the OpenDRIVE file

`length`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

1.8.0

Length of the signal’s bounding box.
@length is defined in the local coordinate system u/v along the u-axis

`name`

string

optional

Name of the signal. May be chosen freely.

`orientation`

[e\_orientation](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D8972119_8CE4_407e_A4AD_3183B0B5C687)

required

"+" = valid in positive s- direction
"-" = valid in negative s- direction
"none" = valid in both directions

`pitch`

double

optional

rad

Pitch angle of the signal, relative to the inertial system (xy-plane)

`roll`

double

optional

rad

Roll angle of the signal after applying pitch, relative to the inertial system (x’’y’’-plane)

`subtype`

string

required

Subtype identifier according to country code or "-1" / "none"

`text`

string

optional

Additional text associated with the signal, for example, text on city limit "City\\nBadAibling"

`type`

string

required

Type identifier according to country code
or "-1" / "none". See extra document.

`unit`

[e\_unit](../16_annexes/map_uml_data_types.html#top-EAID_34376D30_4A82_46e3_9ADC_BCD136B920FF)

optional

Unit of @value

`v`

double

required

m

1.8.0

Local v-coordinate of the sign on the board

`value`

double

optional

Value of the signal, if value is given, unit is mandatory

`width`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

Width of the signal’s bounding box.
@width is defined in the local coordinate system u/v along the v-axis

`z`

double

required

m

1.8.0

Local z-coordinate of the sign on the board

**XML example**

```
<signal s="4.0"
        t="1.0"
        id="534"
        name="board"
        dynamic="no"
        orientation="+"
        zOffset="5.00"
        country="OpenDRIVE"
        type="staticBoard"
        subtype="-1"
        hOffset="0"
        pitch="0"
        roll="0"
        height="2.0"
        width="1.5">
    <validity from="-2" to="-2"/>
    <staticBoard>
        <sign id="535" Country="DE" type="274" subtype="60" countryRevision="2017" v="-0.5" z="1.5" width="0.5" height="0.5" value="60" unit="km/h">
            <validity from="-2" to="-2"/>
            <signalDependency id ="536"/>
            <signalDependency id ="537"/>
        </sign>
        <sign id="536" Country="DE" type="1010" subtype="51" countryRevision="2017" v="-0.75" z="0.9" width="0.420" height="0.231"/>
        <sign id="537" Country="DE" type="1040" subtype="30" countryRevision="2017" v="-0.75" z="0.6" width="0.420" height="0.231" value="22000600"/>
        <sign id="538" Country="DE" type="1012" subtype="36" countryRevision="2017" v="-0.75" z="0.3" width="0.420" height="0.231"/>
        <sign id="539" Country="DE" type="274" subtype="80" countryRevision="2017" v="0.75" z="1.5" width="0.420" height="0.231" value="100" unit="km/h">
            <signalDependency id ="540" />
        </sign>
        <sign id="540" Country="DE" type="1040" subtype="30" countryRevision="2017" v="-0.75" z="0.6" width="0.420" height="0.231" value="22000600"/>
        <sign id="541" Country="DE" type="1012" subtype="36" countryRevision="2017" v="-0.75" z="0.3" width="0.420" height="0.231"/>
    </staticBoard>
 </signal>
```

![img](../_images/14_signals/fig_multistaticsign.png)

Figure 134. multiStaticSign from XML example above

**Rules**

*   [asam.net:xodr:1.8.0:road.signal.boards.static\_board\_use\_correct\_type](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-signal-boards-static-board-use-correct-type): Static signal boards shall be specified to be @type="staticBoard".
    
*   Static signal boards shall be specified to be @dynamic="false".
    
*   The `<validity>` element of a `<sign>` element shall override the `<validity>` element of the parent `<signal>` element.
    
*   The `<signalDependency>` element of a `<sign>` element shall override the `<signalDependency>` element of the parent `<signal>` element.
    
*   Static boards shall not be used for single signals, for example, a stop sign on a single sheet of metal.

**Related topics**

*   [Section 14.3, "Signal dependency"](14_03_signal_dependency.html#top-f4d8bdcc-3f58-454d-b14e-801a880d9c41)
    
*   [Section 14.4, "Signal reference"](14_04_signal_reference.html#top-1030e9ff-6b75-4353-b2b4-043f08c02a2d)
    
*   [Section 14.8, "Signal semantics"](14_08_signal_semantics.html#top-ac3b27c3-c3ac-49cf-bdaf-c52177f1dcee)
    
*   [Section 14.7.2, “Variable message boards (VMS)”](#sec-cb990f03-1e06-4f31-a9df-6cb910f2376a)
    
*   [Section 14.7.3, “Multi boards”](#sec-3a012f70-b671-4287-946c-f8caa3b58c3f)
    
*   [Section 14.7.4, “Gantry”](#sec-6301c5c6-a389-4386-b227-06946186a29a)

## 14.8 Signal semantics

Signals are uniquely defined by the @country, @year, @type, and @subtype attributes. These attributes specify the visualization of the signals because the visualization is different for each country. However, the behavior of the traffic participant is often identical independent of the country, for example, for a stop sign. A simulation engine requires rules specified for all signs for all countries.

The introduction of signal semantics reduces the effort to specify the rules for all signs for all countries. For signal semantics the focus is on the behavior of traffic. Functionality for signal semantics cannot be used for visualization.

As traffic behavior is very complex and also depending on other ASAM OpenDRIVE definitions, for example, the lane width, junctions, and road mark, signal semantics are reduced to a very limited scope. The scope of signal semantics in ASAM OpenDRIVE is limited to traffic behavior that is specified just by signals in ASAM OpenDRIVE. Each traffic behavior is specified by a specific element, for example, by the `<priority>` element that specifies priority regulations.

Table 133. Possible Semantics

Traffic behavior

Description

Example

Link to attribute

Usage in/for `<defaultRegulations>` in `<header>`

Usage in/for `<signal>` or `<sign>`

<lane>

Specifies lane regulations.

Sign that defines cars are not allowed to overtake.

[`<lane>`](#sec-65079286-756b-4880-aa27-25b6358c4a71)

not recommended

recommended

<parking>

Specifies parking regulations.

Sign that defines that parking is forbidden.

no attributes

not allowed

recommended

<priority>

Specifies priority regulations.

Stop sign

[`<priority>`](#sec-672e879a-6d23-4cdf-9ef4-4bdba193313b)

recommend for default junction priority

recommended

<prohibited>

Specifies that certain types of traffic participants are not allowed to enter. Signal semantics for traffic participants in ASAM OpenDRIVE are currently not defined because traffic participants are not harmonized for all standards.

No pedestrians sign

no attributes

recommend for default junction priority

recommended

<routing>

Specifies routing information.

London

no attributes

not allowed

recommended

<speed>

Specifies speed regulations.

Speed limit sign

[`<speed>`](#sec-8398f7c9-c4d5-44e7-8f4e-90a89170ee43)

recommended

recommended

<streetname>

Specifies the name of a street.

High street

no attributes

not allowed

recommended

<tourist>

Specifies tourist information.

Science museum

no attributes

not allowed

recommended

<warning>

Specifies warnings for traffic participant.

Deer might cross the road

no attributes

not allowed

recommended

<supplementaryAllows>

This signal semantic has no meaning on its own. It specifies the type of the traffic participant an exception is made for. Signal semantics for traffic participants in ASAM OpenDRIVE are currently not specified because traffic participants are not harmonized for all standards.

Except bicycles sign

no attributes

not allowed

recommended

<supplementaryDistance>

This signal semantic has no meaning on its own. It specifies the distance after a sign becomes valid or the range in which the sign is valid.

200m sign

[`<supplementaryDistance>`](#sec-9d843dc7-7377-495a-bd64-b9d911638192)

not allowed

recommended

<supplementaryEnvironment>

This signal semantic has no meaning on its own. It specifies under which environmental conditions a sign is valid.

Rain sign

[`<supplementaryEnvironment>`](#sec-17488a44-da60-48ec-b8f3-e58209f56afd)

not allowed

recommended

<supplementaryExplanatory>

This signal semantic has no meaning on its own. It specifies explanations for a sign.

Emission reduction

no attributes

not allowed

recommended

<supplementaryProhibits>

This signal semantic has no meaning on its own. It specifies the type of the traffic participant a restriction is made for. Signal semantics for traffic participants in ASAM OpenDRIVE are currently not specified because traffic participants are not harmonized for all standards.

Truck Symbol

no attributes

not allowed

recommended

<supplementaryTime>

This signal semantic has no meaning on its own. It specifies the time or date a sign is valid.

9:00 - 18:00

[`<supplementaryTime>`](#sec-ac1528f5-8442-4801-b771-23a0e2368363)

not allowed

recommended

**Elements in UML model**

**`<semantics>` element**

UML class:  t\_signals\_semantics
XML tag:    <semantics> (Multiplicity: 0..1)
Introduced: 1.8.0

Semantics are limited to traffic behavior that is specified just by signals in ASAM OpenDRIVE. Each traffic behavior is specified by a specific element.

![img](../_images/uml_class_diagrams/EAID_CA805EC8_2A9C_434e_91E8_E81321F9441F.png)

Figure 136. UML class diagram of the Semantics class

[Figure 136](#fig-2be31cc7-2652-4e1d-8530-a27baaeb2513) shows the UML class diagram of the ASAM OpenDRIVE Semantics class.

**`<lane>` element**

UML class:  t\_signals\_semantics\_lane
XML tag:    <lane> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies lane regulations.

Table 134. Attributes of the <lane> element

Name

Type

Use

Introduced

`type`

[e\_signals\_semantics\_lane](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_867E0EB2_99DA_4750_A148_B608A11DA73A)

required

1.8.0

**`<parking>` element**

UML class:  t\_signals\_semantics\_parking
XML tag:    <parking> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies parking regulations.

**`<priority>` element**

UML class:  t\_signals\_semantics\_priority
XML tag:    <priority> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies priority regulations.

Table 135. Attributes of the <priority> element

Name

Type

Use

Introduced

`type`

[e\_signals\_semantics\_priority](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_6C1E90A5_2BD7_4a01_B744_A04A326D29C6)

required

1.8.0

**`<prohibited>` element**

UML class:  t\_signals\_semantics\_prohibited
XML tag:    <prohibited> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies that certain types of traffic participants are not allowed to enter. Signal semantics for traffic participants in ASAM OpenDRIVE are currently not defined because traffic participants are not harmonized for all standards.

**`<routing>` element**

UML class:  t\_signals\_semantics\_routing
XML tag:    <routing> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies routing information.

**`<speed>` element**

UML class:  t\_signals\_semantics\_speed
XML tag:    <speed> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies speed regulations.

Table 136. Attributes of the <speed> element

Name

Type

Use

Introduced

`type`

[e\_signals\_semantics\_speed](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B7F9C248_F576_458b_8AE4_2BA4A71BBBDA)

required

1.8.0

`unit`

[e\_unitSpeed](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_491DC05E_01C6_49b3_83BE_A06DD81F9C35)

required

`value`

double

required

**`<streetname>` element**

UML class:  t\_signals\_semantics\_streetname
XML tag:    <streetname> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies the name of a street.

**`<tourist>` element**

UML class:  t\_signals\_semantics\_tourist
XML tag:    <tourist> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies tourist information.

**`<warning>` element**

UML class:  t\_signals\_semantics\_warning
XML tag:    <warning> (Multiplicity: 0..\*)
Introduced: 1.8.0

Specifies warnings for traffic participant.

**`<supplementaryAllows>` element**

UML class:  t\_signals\_semantics\_supplementaryAllows
XML tag:    <supplementaryAllows> (Multiplicity: 0..\*)
Introduced: 1.8.0

This signal semantic has no meaning on its own. It specifies the type of the traffic participant an exception is made for. Signal semantics for traffic participants in ASAM OpenDRIVE are currently not specified because traffic participants are not harmonized for all standards.

**`<supplementaryDistance>` element**

UML class:  t\_signals\_semantics\_supplementaryDistance
XML tag:    <supplementaryDistance> (Multiplicity: 0..\*)
Introduced: 1.8.0

This signal semantic has no meaning on its own. It specifies the distance after a sign becomes valid or the range in which the sign is valid.

Table 137. Attributes of the <supplementaryDistance> element

Name

Type

Use

Introduced

`type`

[e\_signals\_semantics\_supplementaryDistance](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_CA994A8F_BDFF_432e_91D1_9162031C921E)

required

1.8.0

`unit`

[e\_unitDistance](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_00C01E54_46BF_4ad3_879B_3D03570EA74D)

required

1.8.0

`value`

double

required

1.8.0

**`<supplementaryEnvironment>` element**

UML class:  t\_signals\_semantics\_supplementaryEnvironment
XML tag:    <supplementaryEnvironment> (Multiplicity: 0..\*)
Introduced: 1.8.0

This signal semantic has no meaning on its own. It specifies under which environmental conditions a sign is valid.

Table 138. Attributes of the <supplementaryEnvironment> element

Name

Type

Use

Introduced

`type`

[e\_signals\_semantics\_supplementaryEnvironment](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B688C467_1003_4fd9_A272_CD13943176CE)

required

1.8.0

**`<supplementaryExplanatory>` element**

UML class:  t\_signals\_semantics\_supplementaryExplanatory
XML tag:    <supplementaryExplanatory> (Multiplicity: 0..\*)
Introduced: 1.8.0

This signal semantic has no meaning on its own. It specifies explanations for a sign.

**`<supplementaryProhibits>` element**

UML class:  t\_signals\_semantics\_supplementaryProhibits
XML tag:    <supplementaryProhibits> (Multiplicity: 0..\*)
Introduced: 1.8.0

This signal semantic has no meaning on its own. It specifies the type of the traffic participant a restriction is made for. Signal semantics for traffic participants in ASAM OpenDRIVE are currently not specified because traffic participants are not harmonized for all standards.

**`<supplementaryTime>` element**

UML class:  t\_signals\_semantics\_supplementaryTime
XML tag:    <supplementaryTime> (Multiplicity: 0..\*)
Introduced: 1.8.0

This signal semantic has no meaning on its own. It specifies the time or date a sign is valid.

Table 139. Attributes of the <supplementaryTime> element

Name

Type

Use

Introduced

`type`

[e\_signals\_semantics\_supplementaryTime](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_2A1E7C8B_8ED8_4590_950F_23EDFF618584)

required

1.8.0

`value`

double

required

1.8.0

**XML example**

```
<signal s="4.0"
        t="1.0"
        id="1"
        name="SpeedLimit60"
        dynamic="no"
        orientation="+"
        zOffset="2.00"
        country="DE"
        countryRevision="2013"
        type="274"
        subtype="56"
        value="60"
        unit="km/h"
        hOffset="0"
        pitch="0"
        roll="0"
        height="0.76"
        width="0.76">
    <semantics>
        <speed type="maximum" value="60" unit="km/h"/>
    </semantics>
</signal>
```

**Rules**

*   Each `<signal>` element may have one ore more semantic elements.
    
*   Signal semantics shall not be specified for signs if no category for the desired traffic behavior exists.

**Related topics**

*   [Section 6.4.3, "`<defaultRegulations>` element"](../06_general_architecture/06_04_header.html#sec-27ad621f-1b2a-40d6-8723-b9f8aa00cb3f)

## 14.9 Signal positioning

The current ASAM OpenDRIVE only places signals at their physical location and uses signal `<reference>` and/or `<dependency>` elements to model, for example the concept of the interaction between stop lines and stop signs or traffic lights.

The ASAM OpenDRIVE Junction guideline describes interactivity between traffic lights and stop lines.

In previous versions of ASAM OpenDRIVE, a signal’s position was identical with its validity and therefor should have been placed next to the road which it is valid for, enabling the application to identify the signals validity. This was called the logical position of a signal. The s-position of the signal described the position on the road where the signal takes effect.

![img](../_images/14_signals/Signals_5.png)

Figure 137. Junction with signals at physical and logical positions

[Figure 137](#fig-32d49d5d-4112-45a4-ba51-c62373663edc) shows how the physical and logical position of a signal could have differed in certain situations. ASAM OpenDRIVE offered two possibilities to describe the physical deviation of a signal. The possibilities were mutually exclusive. The positioning of the signal had no influence on its content.

*   A signal may have been positioned at another physical position that is described with a road reference line coordinate system.
    A signal whose physical position deviated from its logical position was represented by the `<positionRoad>` element within the `<signal>` element. That means, the ID of the specified road was referenced, together with the s- and t-coordinates of the road.
    Examples were different positions of stop signs and stop lines.
    
*   A signal may have been positioned at another physical position that was described with an inertial coordinate system. A signal whose physical position deviates from its logical position and was positioned using inertial coordinates was represented by the `<positionInertial>` element within the `<signal>` element.
    Inertial coordinates were used, for example, if the signal was not placed next to a road, but on the other side of the street or hanging over a junction.

**Elements in UML model**

![img](../_images/14_signals/fig_uml_class_signals_physicalposition.png)

Figure 138. UML class diagram of the t\_physicalPosition element in the Signals class

[Figure 138](#fig-a3fe59ba-6cb0-490d-a9d7-37f0a64b892c) shows the UML class diagram of the t\_physicalPosition element in the ASAM OpenDRIVE Signals class.

**`<positionRoad>` element**

In ASAM OpenDRIVE, a signal position using a referenced road is represented by the `<positionRoad>` element within the `<signal>` element.

UML class:  t\_road\_signals\_signal\_positionRoad
XML tag:    <positionRoad>
Deprecated: 1.8.0

Describes the reference point of the physical position road coordinates in cases where it deviates from the logical position. Defines the position on the road.

Table 140. Attributes of the <positionRoad> element

Name

Type

Use

Unit

Description

`hOffset`

double

required

rad

Heading offset of the signal (relative to @orientation)

`pitch`

double

optional

rad

Pitch angle of the signal after applying hOffset, relative to the inertial system (x’y’-plane)

`roadId`

string

required

Unique ID of the referenced road

`roll`

double

optional

rad

Roll angle of the signal after applying hOffset and pitch, relative to the inertial system (x’’y’’-plane)

`s`

[t\_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate

`t`

double

required

m

t-coordinate

`zOffset`

double

required

m

z offset from road level to bottom edge of the signal

**`<positionInertial>` element**

In ASAM OpenDRIVE, a signal position using inertial coordinates is represented by the `<positionInertial>` element within the `<signal>` element.

UML class: t\_road\_signals\_signal\_positionInertial
XML tag:   <positionInertial>

Describes the reference point of the physical position in inertial coordinates in cases where it deviates from the logical position. Defines the inertial position.

Table 141. Attributes of the <positionInertial> element

Name

Type

Use

Unit

Description

`hdg`

double

required

rad

Heading of the signal, relative to the inertial system

`pitch`

double

optional

rad

Pitch angle of the signal after applying heading, relative to the inertial system (x’y’-plane)

`roll`

double

optional

rad

Roll angle of the signal after applying heading and pitch, relative to the inertial system (x’’y’’-plane)

`x`

double

required

m

x-coordinate

`y`

double

required

m

y-coordinate

`z`

double

required

m

z-coordinate

**XML example**

*   [UC\_LHT\_Complex-TrafficLights.xodr](../_attachments/use_cases/UC_LHT_Complex-TrafficLights/UC_LHT_Complex-TrafficLights.xodr)

**Rules**

The following rules apply to signal positioning:

*   Signals should be placed next to the road for which they are valid.
    
*   The physical position of signals may deviate from their logical position.

**Related topics**

*   [Section 14.1, "Introduction to signals"](14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)
    
*   [Section 14.2, "Lane validity for signals"](14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)
    
*   [Section 14.3, "Signal dependency"](14_03_signal_dependency.html#top-f4d8bdcc-3f58-454d-b14e-801a880d9c41)
    
*   [Section 14.4, "Signal reference"](14_04_signal_reference.html#top-1030e9ff-6b75-4353-b2b4-043f08c02a2d)
