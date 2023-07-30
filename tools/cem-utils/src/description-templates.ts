/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { has } from "../../utilities";
import type * as schema from "custom-elements-manifest";
import { Component } from "./types";
import { BaseOptions } from "../../configurations";
import { getDescription, getMethods } from "./cem-utilities";

export function getComponentDetailsTemplate(
  component: Component,
  options: BaseOptions,
) {
  const slots = getSlotsTemplate(
    component?.slots,
    options?.hideSlotDocs,
    options?.labels?.slots
  );
  const events = getEventsTemplate(
    component?.events,
    options?.hideEventDocs,
    options?.labels?.events
  );
  const cssProps = getCssPropsTemplate(
    component?.cssProperties,
    options?.hideCssPropertiesDocs,
    options?.labels?.cssProperties
  );
  const parts = getPartsTemplate(
    component?.cssParts,
    options?.hideCssPartsDocs,
    options?.labels?.cssParts
  );
  const methods = getMethodsTemplate(
    getMethods(component),
    options?.hideMethodDocs,
    options?.labels?.methods
  );

  return (
    getDescription(component, options?.descriptionSrc) +
    "\n\n\n---\n\n\n" +
    events +
    methods +
    slots +
    cssProps +
    parts
  );
}

export function getSlotsTemplate(
  slots?: schema.Slot[],
  hide?: boolean,
  label = "Slots"
): string {
  return has(slots) && !hide ? `\n\n### **${label}:**\n ${getSlotDocs(slots!)}` : "";
}

export function getEventsTemplate(
  events?: schema.Event[],
  hide?: boolean,
  label = "Events"
): string {
  return has(events) && !hide ? `\n\n### **${label}:**\n ${getEventDocs(events!)}` : "";
}

export function getCssPropsTemplate(
  cssProperties?: schema.CssCustomProperty[],
  hide?: boolean,
  label = "CSS Properties"
): string {
  return has(cssProperties) && !hide
    ? `\n\n### **${label}:**\n ${getCssPropertyDocs(cssProperties!)}`
    : "";
}

export function getPartsTemplate(
  cssParts?: schema.CssPart[],
  hide?: boolean,
  label = "CSS Parts"
): string {
  return has(cssParts) && !hide
    ? `\n\n### **${label}:**\n ${getCssPartsDocs(cssParts!)}`
    : "";
}

export function getMethodsTemplate(
  methods?: schema.ClassMethod[],
  hide?: boolean,
  label = "Methods"
): string {
  return has(methods) && !hide
    ? `\n\n### **${label}:**\n ${getMethodDocs(methods!)}`
    : "";
}

function getEventDocs(events: schema.Event[]) {
  return events
    ?.map((event) => `- **${event.name}** - ${event.description}`)
    .join("\n");
}

function getCssPropertyDocs(properties: schema.CssCustomProperty[]) {
  return properties
    ?.map(
      (prop) =>
        `- **${prop.name}** - ${prop.description} _(default: ${prop.default})_`
    )
    .join("\n");
}

function getCssPartsDocs(parts: schema.CssPart[]) {
  return parts
    ?.map((part) => `- **${part.name}** - ${part.description}`)
    .join("\n");
}

function getSlotDocs(slots: schema.Slot[]) {
  return slots
    ?.map(
      (slot) =>
        `- ${slot.name ? `**${slot.name}**` : "_default_"} - ${
          slot.description
        }`
    )
    .join("\n");
}

function getMethodDocs(methods: schema.ClassMethod[]) {
  return methods
    ?.map(
      (method) =>
        `- **${method.name}${getParameters(method.parameters)}${
          method.return ? `: _${method.return.type?.text}_` : ""
        }** - ${method.description}`
    )
    .join("\n");
}

function getParameters(parameters?: schema.Parameter[]): string {
  return parameters
    ? "(" +
        parameters
          .map(
            (x) => `${x.name + (x?.type?.text ? `: _${x?.type?.text}_` : "")}`
          )
          .join(", ") +
        ")"
    : "()";
}