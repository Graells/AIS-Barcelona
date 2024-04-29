import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl p-7">
      <header>
        <h1 className="mb-4 text-xl font-bold">About the Project</h1>
      </header>
      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold">Introduction</h2>
          <p className="mt-2 text-base">
            In this project, a visualization tool is developed to leverage the
            data obtained from one of FNB&apos;s AIS antennas. This antenna
            captures all the maritime traffic data emitted by vessels within the
            FNB radius.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">System Architecture</h2>
          <p className="mt-2 text-base">
            The system employs a Raspberry Pi linked to the AIS antenna, which,
            in real-time, communicates with a server. This server processes,
            filters, and relays the relevant maritime data to a frontend
            website, designed for user-friendly visualization.
          </p>
          <p className="mt-2 text-base">
            The tool&apos;s development involves the following stages: firstly,
            establishing a real-time connection with the Raspberry Pi using bash
            and Python scripts for continuous data updates. Secondly, creating a
            server infrastructure that leverages a Python library for efficient
            data handling and filtering of relevant information. Finally, the
            creation of a user-friendly website interface to display real-time
            maritime traffic in an interactive map, among other data
            visualizations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Objectives and Impact</h2>
          <p className="mt-2 text-base">
            The project&apos;s objective is to create an infrastructure to
            leverage the data collected by a private AIS antenna receiver. This
            infrastructure not only allows the visualization on a map but also
            enhances AIS data handling capabilities collected from a private AIS
            receiver, which I believe opens the door for further applications
            and analyses of AIS data within the maritime sector. Thereby,
            unlocking new research potentials and operational insights.
          </p>
        </section>
      </main>
      <footer>
        <p className="mt-8 text-sm">
          2024 FNB Visualization Tool for Vessel Positions Within FNB&apos;s
          Radius
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
