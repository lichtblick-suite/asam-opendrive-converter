> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 00 Preface and scope

## 00 Foreword

ASAM e.V. (Association for Standardization of Automation and Measuring Systems) is a non-profit organization that promotes standardization of tool chains in automotive development and testing. Our members are international car manufacturers, suppliers, tool vendors, engineering service providers, and research institutes. ASAM standards are developed by experts from our member companies and are based on real use cases. ASAM is the legal owner of these standards and is responsible for their distribution and marketing.

ASAM standards span a wide range of use cases in automotive development, test, and validation. They define file formats, data models, protocols, and interfaces. The standards enable easy exchange of data and tools within and across tool chains. They are applied worldwide.

ASAM OpenDRIVE specifies the modeling approach of how to describe static road networks for driving simulation applications using the Extensible Markup Language (XML).

ASAM OpenDRIVE consists of:

*   Specification  
    Describes the modeling approach of how to describe static road networks for driving simulation applications.
    
*   Enterprise Architect UML model reference  
    Documents the data model for ASAM OpenDRIVE.
    
*   Junction Guideline 1.0.0 (supplementary document, non-normative)  
    Guidelines on how to model junctions and on selecting an appropriate junction type.
    
*   Signal reference 1.0.0 (supplementary document, normative)  
    Specifies elements that are considered signals in ASAM OpenDRIVE, for example traffic lights, that do not have any official @type and @subtype representation.

## 00 Introduction

ASAM OpenDRIVE was developed in response to demand for the specification of an exchange format to define static road networks that can be used in driving simulation applications.

The ASAM OpenDRIVE Specification specifies the file format for static road network descriptions. The Extensible Markup Language (XML) is used to represent these descriptions. The ASAM OpenDRIVE Specification specifies how to model static road networks. In more detail, it specifies the structure, the sequence, the elements, and values to represent static road networks.

Static road networks consist of, for example, roads, lanes, signals, junctions, and objects along the road, for example, traffic islands. The static road networks described in an ASAM OpenDRIVE file can be either artificial or derived from real world data. ASAM OpenDRIVE does not define dynamic content, for example, traffic participants and moving objects.

ASAM OpenDRIVE descriptions may contain:

*   Road definitions
    
    *   Road geometry in plan view
        
    *   Lateral and elevation profiles of roads
        
    *   Lanes
        
    *   Road marks
        
    *   Signals and their validity for specific roads and lanes
        
    *   Objects along roads
        
    
*   Junctions
    
    *   Junction types
        
    *   Connections
        
    *   Junction areas
        
    
*   Junction groups
    
*   References to controllers for traffic lights
    
*   Tram and railway tracks
    

Every ASAM OpenDRIVE element can be extended by user-defined data. For example, when defining a speed limit sign, the only way to reference an external 3D object of that speed limit sign is to use the `<userData>' element. The extensibility facilitates a high degree of specialization for individual applications, while supporting exchangeability of ASAM OpenDRIVE data between different applications.

ASAM OpenDRIVE is part of the ASAM domain of simulation standards that focus on simulation data for the automotive environment. Next to ASAM OpenDRIVE, ASAM provides other standards in the simulation domain, such as ASAM OpenCRG and ASAM OpenSCENARIO.

![img](../_images/00_preface/overview_open_x.png)

Figure 1. Relationship between ASAM OpenDRIVE, ASAM OpenCRG, and ASAM OpenSCENARIO

[Figure 1](#fig-60c22aa8-d229-456a-b39d-645b894d4cad) shows how to combine ASAM OpenDRIVE, ASAM OpenCRG, and ASAM OpenSCENARIO to define a scenario-driven description for traffic simulation that contains static and dynamic content.

ASAM OpenCRG enables to add detailed road surface descriptions to road networks defined in ASAM OpenDRIVE. Like ASAM OpenDRIVE, ASAM OpenCRG does not define dynamic content. ASAM OpenSCENARIO enables to add dynamic content to road networks defined in ASAM OpenDRIVE.

## 01 Scope

ASAM OpenDRIVE specifies the modeling approach of how to describe static road networks for driving simulation applications using the Extensible Markup Language (XML).

The ASAM OpenDRIVE standard has the following scope:

*   Specify the schema for ASAM OpenDRIVE in an UML model and XSD schemas. The UML model and the XSD schemas define the structure, sequence, elements, and values of ASAM OpenDRIVE. The XSD schemas are derived from the UML model.
    
*   Provide the XSD schemas to which valid ASAM OpenDRIVE files shall conform.
    
*   Explain how the ASAM OpenDRIVE elements are used and relationships between elements in the ASAM OpenDRIVE UML model and XSD schemas, for example, roads, lanes, junctions, objects, signals, and railroads.
    
*   Give additional guidelines and rules, that cannot be represented in the UML model and XSD schemas for using ASAM OpenDRIVE.

## 02 Normative references

The following documents are referred to in the text in such a way that some or all of their content constitutes requirements of this document. For dated references, only the edition cited applies. For undated references, the latest edition of the referenced document (including any amendments) applies.

Standards referenced in this section are normative in such a way that parts or the whole standard shall be applied when implementing the referenced functionality. Standards referenced in this section shall be cited normatively in the text.

*   ASAM OpenCRG [[2](../bibliography.html#bib-ocr)]
    
*   ASAM OpenSCENARIO [[3](../bibliography.html#bib-osc)]
    
*   ISO 3166-1 [[4](../bibliography.html#bib-iso3166-1)]
    
*   ISO 3166-2 [[5](../bibliography.html#bib-iso3166-2)]
    
*   ISO 8855 [[6](../bibliography.html#bib-iso8855)]
    
*   ISO 8601 [[7](../bibliography.html#bib-iso8601)]
    
*   ISO 19111 [[8](../bibliography.html#bib-iso19111)]
    
*   OMG® UML 2.5.1 [[9](../bibliography.html#bib-omguml)]
    
*   W3C XML [[10](../bibliography.html#bib-w3cxml)]
    
*   W3C XML Schema [[11](../bibliography.html#bib-w3cxmlschema)]

## 03 Terms and definitions

Bridge

Bridges are modeled as objects in ASAM OpenDRIVE. The road with the bridge object leads over a bridge. Bridges are valid for a road’s complete cross section unless a lane validity record with further restrictions is provided as child element.

Common junction

Common junctions are the default type of junction in ASAM OpenDRIVE and specify areas where drivable lanes may overlap and traffic may cross.

Connecting road

Connecting roads are part of a junction and link the roads going in and out.

Touching point

The touching points of a lane are the starting and end positions of the lane at its inner and outer edges. A touching point has a position in x, y, z and a heading, pitch and roll.

Crossing

Crossings are junctions without connecting roads. They define sections where crossing traffic can appear. Traffic does not change roads at crossings, for example, at railway crossings.

Direct junction

Direct junctions are intended to model entries and exits where drivable lanes may overlap to split or merge, but traffic does not cross.

Entry

Entries are locations where roads merge into another road. Entries are not the same as the `entry` value of the @type attribute at the `<lane>` element which is used for the acceleration lane.

Exit

Exits are locations where a road splits into other roads. Exits are not the same as the `exit` value of the @type attribute at the `<lane>` element which is used for the deceleration lane.

Incoming road

Incoming roads contain lanes that lead into a junction.

Inertial coordinate system

An inertial coordinate system is a right-handed coordinate system according to ISO 8855.

Junction

Junctions model intersections between roads.

Junction group

Junction groups indicate for routing that the grouped junctions belong to the same node and are commonly seen as one big junction, for example roundabouts or highway interchanges.

Lane

Lanes are an essential part of all roads. Lanes are attached to the road reference line and are defined from inside to outside.

Lane offset

Lane offsets shift the center lane away from the road reference line.

Lane section

A lane section splits a road into multiple parts whenever the number of lanes or their function changes.

Lane type

A lane has one lane type that defines its function, for example, driving, biking, or exit.

Lane validity

Lane validities restrict signals and objects to specific lanes.

Lane width

Lane widths widen or narrow lanes along the t-coordinate within lane sections.

Local coordinate system

A local coordinate system is a right-handed coordinate system according to ISO 8855.

Object

Objects influence a road by expanding, delimiting, or supplementing its course. Objects are elements that form the environment, for example, buildings, guard rails, poles, and trees. Objects do not influence the behavior of traffic directly, unlike signals.

Outgoing road

Outgoing roads are not specifically defined as an element or attribute in ASAM OpenDRIVE. Incoming roads serve as outgoing roads. These roads are implicitly defined as outgoing by the connecting roads that lead into them.

Road

Roads are the core elements for any road network in ASAM OpenDRIVE. Each road runs along one road reference line.

Road elevation

Road elevation specifies the elevation along the road reference line, that is in s direction.

Road marking

Road markings in ASAM OpenDRIVE are defined as lane markings, object markings, for example parking boxes, or signals, for example stop lines.

Road reference line

A road reference line defines the horizontal alignment of a road and consists of one or more geometry elements. Every road has one road reference line. Further properties of the road, for example, lanes, signals, and objects are defined relative to the road reference line.

Road reference line coordinate system

The road reference line is always located within the x/y-plane defined by the inertial coordinate system. A road reference line coordinate system runs along the road reference line. It is a right-handed coordinate system. The s-axis follows the tangent of the road reference line. The t-axis is orthogonal to the s-axis. The right-handed coordinate system is completed by defining the up-direction `h` orthogonal to x-axis and y-axis.

s-coordinate

The s-coordinate is defined along the road reference line, measured in meters from the beginning of the road reference line.

Signal

Signals are traffic signs, traffic lights, and specific road markings for the control and regulation of road traffic.

Signal controller

A signal controller applies a signal cycle (see [signal cycle](#sec-fe178b76-4fb3-48c9-b19c-981b8b9a787f)) to a signal or a signal group (see [signal group](#sec-5dffe4c1-df1e-4cf7-b9a4-b8eac9a3683e)).

Signal cycle

A signal cycle is an ordered list of phases (see [signal phase](#sec-a435dfb3-ccb8-4235-ba38-01e74ef56d0e)) for one dynamic signal.

Signal dependency

Signal dependencies limit or extend the validity of one signal by an additional signal. For example, a speed limit sign of 60 km/h that is only valid for trucks, specified by a supplementary sign. One signal may have multiple dependencies.

Signal group

Each dynamic signal needs to be in exactly one signal group.

Signal phase

A phase of a dynamic signal is the semantic state (see [signal state](#sec-ca1171ec-384a-4d5a-b377-82e719da237b)) in combination with a (possibly infinite) duration, which specifies how long this semantic state is active. This term is not to be confused with the English civil engineering term _stage_ or the German term _phase_.

Signal reference

Signal references link a signal to another signal or object. One signal may have multiple signal references. The signal reference term should not to be confused with the `<signalReference>` element that is used to link a signal to multiple roads.

Signal state

A state of a dynamic signal is the combination of the semantic and the observable state of a signal.

Signal synchronization group

Multiple signal groups (see [signal group](#sec-5dffe4c1-df1e-4cf7-b9a4-b8eac9a3683e)) which should be kept synchronized and whose signal cycles (see [signal cycle](#sec-fe178b76-4fb3-48c9-b19c-981b8b9a787f)) have the same finite duration can, but are not required to be mapped to a synchronization group. This mapping can be used to indicate that whenever the phase of one signal group is set, by an ASAM OpenSCENARIO `TrafficSignalControllerAction` or otherwise, the other signal groups in that synchronization group should be set to the corresponding position in their signal cycles.

Slip lane

On a slip lane a driver can change roads without driving into the main intersection.

Static road network

Collection of connected roads enriched by static objects that do not change during runtime of a simulation.

Superelevation

Superelevation specifies the transverse slope along the road reference line. Superelevation is defined for a cross section and can vary in road reference line direction.

t-coordinate

The t-coordinate is defined as the lateral position orthogonal to the road reference line.

Tunnel

Tunnels are modeled as objects in ASAM OpenDRIVE. The road with the tunnel object defines the part of the road that is the tunnel or the underpass.

Virtual junction

Virtual junctions manage connections within an uninterrupted road, for example, entries and exits to parking lots, and pedestrian crossings.

VMS board

Variable message boards can change their values during the simulation in ASAM OpenSCENARIO.

## 04 Abbreviations

ASAM

Association for Standardization of Automation and Measuring Systems

CRG

Curved Regular Grid

ECU

Electronic Control Unit

PROJ

PROJ coordinate transformation software library

TM

Transverse Mercator

UML

Unified Modeling Language

XML

Extensible Markup Language

## 05 Backward compatibility

ASAM OpenDRIVE 1.8.1 is backwards compatible with ASAM OpenDRIVE 1.8.0.

As a maintenance version, it fixes some bugs present in 1.8.0 and introduces a new chapter, but all existing features from ASAM OpenDRIVE 1.8.0 remain supported. For a full list of changes see [Annex F.1, _Revision history ASAM OpenDRIVE 1.8.0_](../16_annexes/revision_history/ASAM_OpenDRIVE_revision_history_V1-8-0.html#top-8014cba9-57bc-4b2e-b07c-44dcc0886381-1-8-0).

## 07 Additional data

Raw data or data from external sources that is integrated in ASAM OpenDRIVE may be of varying quality. It is possible to describe quality and accuracy of external data in ASAM OpenDRIVE. They may be stored at any position in ASAM OpenDRIVE.

**`<dataQuality>` element**

In ASAM OpenDRIVE, data quality from external sources is represented by `<dataQuality>` elements.

UML class: t_dataQuality
XML tag:   <dataQuality> (Multiplicity: 0..1)

Describes the quality and accuracy of measurement data that is integrated into the ASAM OpenDRIVE file.

Measurement data derived from external sources like GPS that is integrated in ASAM OpenDRIVE may be inaccurate.

**`<error>` element**

In ASAM OpenDRIVE, the absolute or relative errors of road data are described by `<error>` elements within the `<dataQuality>` element.

UML class: t_dataQuality_Error
XML tag:   <error> (Multiplicity: 0..1)

Describes the error range, given in [m], of measurement data that is integrated into the ASAM OpenDRIVE file.

Table 15. Attributes of the <error> element     

Name

Type

Use

Unit

Description

`xyAbsolute`

double

required

m

Absolute error of the road data in x/y direction

`xyRelative`

double

required

m

Relative error of the road data between adjacent element entries in x/y direction.

`zAbsolute`

double

required

m

Absolute error of the road data in z direction

`zRelative`

double

required

m

Relative error of the road data between adjacent element entries in z-direction.

Additional meta data about the raw data that is integrated can be stored in the ASAM OpenDRIVE.

**`<rawData>` element**

In ASAM OpenDRIVE, the raw data is described by the `<rawData>` element within the `<dataQuality>` element.

UML class: t_dataQuality_RawData
XML tag:   <rawData> (Multiplicity: 0..1)

Describes some basic metadata containing information about the raw data.

Table 16. Attributes of the <rawData> element    

Name

Type

Use

Description

`date`

string

required

Date of the delivery of raw data, to be given in ISO 8601 notification (YYYY-MM-DDTHH:MM:SS). Time-of-day may be omitted

`postProcessingComment`

string

optional

Comments concerning the post processing attribute. Free text, depending on the application

`postProcessing`

[e_dataQuality_RawData_PostProcessing](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_65FD4263_96F1_4cf0_8CD3_8BB98CB42D3F)

required

Information about the kind of data handling before exporting data into the ASAM OpenDRIVE file

`sourceComment`

string

optional

Comments concerning the @source . Free text, depending on the application

`source`

[e_dataQuality_RawData_Source](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_1C20343D_D9E2_4bf6_9347_EA7C6496DE29)

required

Source that has been used for retrieving the raw data; further sources to be added in upcoming versions

## Bibliography

[1] _[](https://spatialreference.org/ref/epsg/4326/)_EPSG:4326_, epsg projection 4326 - wgs 84_. 2007. [viewed 2023-08-08]

[2] _[](https://www.asam.net/index.php?eID=dumpFile&t=f&f=3950&token=21a7ae456ec0eb0f9ec3aee5bae3e8c9ebaea140)_ASAM OpenCRG_,_ 1.2.0

[3] _[](https://www.asam.net/index.php?eID=dumpFile&t=f&f=4908&token=ae9d9b44ab9257e817072a653b5d5e98ee0babf8)_ASAM OpenSCENARIO_,_ 1.2.0

[4] _[](https://www.iso.org/standard/63545.html)_ISO 3166-1:2013_, Codes for the representation of names of countries and their subdivisions — Part 1: Country codes_

[5] _[](https://www.iso.org/standard/63546.html)_ISO 3166-2:2013_, Codes for the representation of names of countries and their subdivisions — Part 2: Country subdivision code_

[6] _[](https://www.iso.org/standard/51180.html)_ISO 8855:2011_, Road vehicles — Vehicle dynamics and road-holding ability — Vocabulary_

[7] _[](https://www.iso.org/iso-8601-date-and-time-format.html)_ISO 8601:2019_, Date and time format_

[8] _[](https://www.iso.org/standard/74039.html)_ISO 19111:2019_, Geographic information — Referencing by coordinates_

[9] _[](https://www.omg.org/spec/UML/2.5.1/About-UML/)_UML®️_, Unified Modeling Language,_ 2.5.1. 2017. [viewed 2023-08-08]

[10] _[](https://www.w3.org/TR/2008/REC-xml-20081126/)_XML_, Extensible Markup Language (XML) 1.0 (Fifth Edition)_. 2013. [viewed 2023-08-08]

[11] _[](https://www.w3.org/TR/xmlschema11-1/)_XML Schema_, W3C XML Schema Definition Language (XSD) 1.1 Part 1: Structures_. 2012. [viewed 2023-08-08]

[12] _IEEE Standard for Floating-Point Arithmetic_ [online]. 2019. Available at: doi:10.1109/IEEESTD.2019.8766229

[14] ADAMS, Ulf. [Ryū: fast float-to-string conversion](https://dl.acm.org/doi/abs/10.1145/3192366.3192369). In: _Proceedings of the 39th ACM SIGPLAN Conference on Programming Language Design and Implementation_. Philadelphia, PA, USA: Association for Computing Machinery, 2018, p. 270–282.

[16] _[](http://spatialreference.org/ref/epsg/32632/)_EPSG:32632_, epsg projection 32632 - wgs 84 / utm zone 32n_. 1995. [viewed 2023-08-08]

[18] _[](https://epsg.io)_EPSG.io_, EPSG.io Coordinate Systems Worldwide_. 2023. [viewed 2023-08-02]
