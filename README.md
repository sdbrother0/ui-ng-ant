# Getting Started

### UI for (https://github.c
om/sdbrother0/srv) clone and build:

```
git clone https://github.com/sdbrother0/ui-ng-ant.git
cd ui-ng-ant
npm i
```

### Change apiUrl:

change apiUrl in file: https://github.com/sdbrother0/ui-ng-ant/blob/main/src/environments/environment.ts#L2 to your
(e.g.: `http://localhost:8090` -> `http://192.168.1.20:8090`)
```
export const environment = {
  apiUrl: 'http://192.168.1.20:8090'
};
```
### Run:
```
ng serve
```

### About UI (Based on components):

## Inline edit:
![inline-edit.png](img%2Finline-edit.png)

## Lookup component:
![lookup.png](img%2Flookup.png)

## Master details:
![master-details.png](img%2Fmaster-details.png)

## Reports:
![rep.png](img%2Frep.png)
