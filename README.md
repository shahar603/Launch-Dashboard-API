<h1 align="center">Launch Dashboard API</h1>
<p align="center">An Open Source REST API of Rocket Launch telemetry</p>

<p align="center">
  <img src="https://i.imgur.com/1awBiUj.png"/>
</p>


<p align="center">
  <a href="https://github.com/shahar603/Launch-Dashboard-API/actions">
    <img src="https://github.com/shahar603/Launch-Dashboard-API/actions/workflows/main.yml/badge.svg">
  </a>
  <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">
    <img src="https://img.shields.io/badge/interface-REST-brightgreen.svg?longCache=true&style=flat-square">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/shahar603/Launch-Dashboard-API/wiki">Documentation</a> - 
  <a href="#Clients">Clients</a> - 
  <a href="#Apps">Apps</a> -
  <a href="#data-sources">Data Sources</a>
</h1>


## Usage

```javascript
curl -s http://api.launchdashboard.space/v2/launches/latest/spacex | jq
```

```javascript
{
  "mission_id": "amos-17",
  "name": "Amos-17",
  "flight_number": 83,
  "launch_library_2_id": "68ecf878-2491-4209-95fe-54f74fb163aa",
  "raw": [
    {
      "stage": 2,
      "telemetry": [
        { "time": 0, "velocity": 0.277, "altitude": 0 },
        { "time": 0.033, "velocity": 0.555, "altitude": 0 },
        { "time": 0.067, "velocity": 0.555, "altitude": 0},
        { "time": 0.1, "velocity": 0.555, "altitude": 0 },
        { "time": 0.133, "velocity": 0.555, "altitude": 0 },
        { "time": 0.166, "velocity": 0.833, "altitude": 0 },
        { "time": 0.2, "velocity": 0.833, "altitude": 0 },
        ...
        { "time": 1918.333, "velocity": 9518.333, "altitude": 525},
        { "time": 1918.366, "velocity": 9518.333, "altitude": 525}
      ]
    }
  ],
  "analysed": [
    {
      "stage": 2,
      "telemetry": [
        { "time": 0, "velocity": 0.277, "altitude": 0, "velocity_y": -0.219, "velocity_x": 0.168, "acceleration": 10.698 "downrange_distance": 0, "angle": 90, "q": 0.046996480116054146 },
        { "time": 1, "velocity": 1.97, "altitude": 0.001, "velocity_y": 2.039, "velocity_x": -0.038, "acceleration": 11.285, "downrange_distance": 0, "angle": 90, "q": 2.3762015600538513 },
        ...
        { "time": 506, "velocity": 7424.372, "altitude": 163.85, "velocity_y": -32.707, "velocity_x": 7424.301, "acceleration": -0.016, "downrange_distance": 1585.22, "angle": -0.252, "q": 0 }
      ]
    }
  ],
  "events": [
    { "key": "maxq", "time": 66 },
    { "key": "throttle_down_start", "time": 45 },
    { "key": "throttle_down_end", "time": 91 },
    { "key": "meco", "time": 169 },
    ...
  ]
}
```

## Contributions

See [Contributing.md](https://github.com/shahar603/Launch-Dashboard-API/blob/master/CONTRIBUTING.md) for contribution instructions.



## Apps
The Apps and Tools that use Launch Dashboard API

|App|Description|Creator|
|-----|-----|----|
|[FlightClub.io](https://www2.flightclub.io/)|Rocket Launch Simulation and Visualization|[u/TheVehicleDestroyer](https://www.reddit.com/user/thevehicledestroyer)|


## Derivative Content
Content made using Launch Dashboard API

|Content|Description|Creator|
|-----|-----|----|
|[Starlink-18 First Stage Telemetry and Analysis](https://www.reddit.com/r/spacex/comments/ldkz7c/starlink18_first_stage_telemetry_and_analysis/)| My analysis of first stage telemetry of a SpaceX Starlink (SpaceX's internet constellation) launch|[Shahar603](https://github.com/shahar603)|
|[Unplanned engine shutdown of Falcon 9 rocket](https://www.reddit.com/r/SpaceXLounge/comments/fkpb37/starlink5_telemetry_confirming_the_early_engine/)|Acceleration graph from LD API affirmed the space community suspicion of an unplanned engine shutdown during Falcon 9 ascent. Later confirmed by [Elon Musk on twitter](https://twitter.com/elonmusk/status/1240262636547100672)|[Shahar603](https://github.com/shahar603)|
|[Aerodynamic Pressure animation](https://twitter.com/JcAsHcan/status/1188125678396493825)|An animation of the aerodynamic pressure(Q) during ascent on the AMOS-17 mission|[Jake Hannan](https://twitter.com/JcAsHcan)|
|[Mission Creation](https://twitter.com/flightclubio/status/1199805613749915648)|A tools that builds a flight plan that matches the webcast telemetry in the API |[u/TheVehicleDestroyer](https://www.reddit.com/user/thevehicledestroyer)|
|[Falcon Boosters' Entry Energy Comparison](https://www.reddit.com/r/spacex/comments/elzp52/falcon_boosters_entry_energy_comparison/)|A diagram that compares total energy of the Falcon boosters' reentry energy|[Shahar603](https://github.com/shahar603)

## Clients
Clients and APIs using Launch Dashboard API

|Client|Description|Creator|
|-----|-----|----|
|[.NET Launch Dashboard](https://github.com/Tearth/.NET-Launch-Dashboard)| .NET Wrapper for Launch Dashboard API|[Tearth](https://github.com/Tearth)

## Data Sources
The Source of the data in the API

|Launch Provider|Tool|Creator|
|----|-----|-----|
|SpaceX|[SpaceXtract](https://github.com/shahar603/SpaceXtract)|[Shahar603](https://github.com/shahar603)|
|RocketLab|[SpaceXtract](https://github.com/shahar603/SpaceXtract)|[Shahar603](https://github.com/shahar603)|
|Arianespace|[VideoTelemetryParser](https://github.com/Togusa09/VideoTelemetryParser)|[Hitura-Nobad](https://www.reddit.com/user/hitura-nobad/)|


