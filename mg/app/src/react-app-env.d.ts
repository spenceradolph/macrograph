/// <reference types="react-scripts" />
/// <reference path="../@types/index.d.ts" />
/// <reference path="../node_modules/ts-transform-async-to-mobx-flow/transformToMobxFlow.d.ts"/>

declare global {
  interface Window {
    declare transformToMobxFlow: PropertyDecorator;
  }
}
