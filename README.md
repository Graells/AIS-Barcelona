# About the Project

## Introduction
In this project, a visualization tool is developed to leverage the data obtained from one of FNB's AIS antennas. This antenna captures all the maritime traffic data emitted by vessels within the FNB radius.

## System Architecture
The system employs a Raspberry Pi linked to the AIS antenna, which, in real-time, communicates with a server. This server processes, filters, and relays the relevant maritime data to a frontend website, designed for user-friendly visualization.

The tool's development involves the following stages:
1. Establishing a real-time connection with the Raspberry Pi using bash and Python scripts for continuous data updates.
2. Creating a server infrastructure that leverages a Python library for efficient data handling and filtering of relevant information.
3. Creation of a user-friendly website interface to display real-time maritime traffic in an interactive map, among other data visualizations.

## Objectives and Impact
The project's objective is to create an infrastructure to leverage the data collected by a private AIS antenna receiver. This infrastructure not only allows the visualization on a map but also enhances AIS data handling capabilities collected from a private AIS receiver, which opens the door for further applications and analyses of AIS data within the maritime sector. Thereby, unlocking new research potentials and operational insights.

### 2024 FNB Visualization Tool for Vessel Positions Within FNB's Radius
