# JSON Data Manager
An Electron desktop app that allows you to perform CRUD operations on tables/collections that are stored as json files. The JSON Data Manager is a tool that treats your JSON data files as though they were database tables (similar to what you would have in MySQl or MongoDB). 

***-INSERT GIF HERE-***

## Why this project even exists?
I needed a way to better manage item data for a game I was creating. Many games have items, weapons, power-ups etc. that players can collect and use. These items tend to have varying properties.

A dagger could have the following properties:

```json
dagger:{
    "damage":200,
    "swing_recovery":2
}
```
And let's say a long sword has the following propoerties:

```json
long_sword:{
    "damage":500,
    "swing_recovery":5,
    "durability":300
}
```
Having to manage this kind of data for 100 weapons can be a pain if you are using  things like diectionaries in your code. 

What happens when you want to update the name of the property. i.e. instead of `damage` say you want it to be `physical_damage` so that you can have additional properties like `fire_damage`.

Or say you want to set a default value for some property. 

In short, managing large amounts of data (in this JSON-like format) soon becomes a a huge problem.

This project was inspired by [CastleDB](http://castledb.org/) which addresses the problem described above. However, CastleDB is based on [HAXE](https://haxe.org/). This project runs on electron and vuejs for its frontend. I'm more familiar with web tech. Plus there are specific features I needed in a the tool (See features below).

Ultimately, what I wanted to end up creating is this:

```json
    "wapones":[
        {
            "name":"dagger",
            "physical_damage":200,
            "fire_damage":0,
            "swing_recovery":2,
            "durability":500
        },
        {
            "name":"long_sword",
            "physical_damage":500,
            "fire_damage":120,
            "swing_recovery":5,
            "durability":300
        },
    ]
```



## Run Dev
To run the project in dev just run the following in your terminal

``` git clone https://github.com/kidando/json_data_manager.git [your_project_folder]```

``` cd [your_project_folder] ```

``` npm install ```

``` npm run electron:serve ```

## Releases
soon

## Features / To-Do List

| Item | Done? |
| :------ | ----: |
| Create Datafile | ✔️ |
| Save changes to Datafile | ✔️ |
| Add columns to datafile | ✔️ |
| Edit columns in datafile | ✔️ |
| Insert records into datafile | ✔️ |
| Edit records in datafile | ✔️ |
| Delete records in datafile | ✔️ |
| Delete columns in datafile |  |
| is_unique validation check for existing columns before saving  |  |
| Import Datafile | |
| Re-order columns |  |
| Create Project |  |
| Edit/Update Project |  |
| Add DataFiles to projects |  |
| More meaningful main menu |  |
| Datatype: Pre-defined list (Array) |  |
| Datatype: Vector2 |  |
| Datatype: Vector3 |  |
| Datatype: Multiline-string or Dictionary |  |
| Enable/Disable Auto-save |  |
| Save/load window size state |  |
| Tutorial on how to use JSON Data Manager |  |
| Tutorial on how to use JSON Data Manager with Godot |  |


## Licence
MIT License - Copyright (c) 2020 Leon Oscar Kidando