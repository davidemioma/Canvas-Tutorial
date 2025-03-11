"use client";

import React from "react";
import { Color } from "@/types";
import { colorToCss } from "@/lib/utils";

type Props = {
  onChange: (color: Color) => void;
};

type BtnProps = {
  color: Color;
  onClick: (color: Color) => void;
};

const ColorButton = ({ color, onClick }: BtnProps) => {
  return (
    <button
      className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition-opacity"
      onClick={() => {
        onClick(color);
      }}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};

const ColorPicker = ({ onChange }: Props) => {
  return (
    <div className="w-full max-w-[164px] flex flex-wrap items-center gap-2 pr-2 mr-2 border-r border-neutral-200">
      <ColorButton
        color={{
          r: 0,
          g: 0,
          b: 0,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 255,
          g: 255,
          b: 255,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 255,
          g: 99,
          b: 71,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 50,
          g: 205,
          b: 50,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 30,
          g: 144,
          b: 255,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 255,
          g: 215,
          b: 0,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 147,
          g: 112,
          b: 219,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 220,
          g: 20,
          b: 60,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 0,
          g: 128,
          b: 128,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 255,
          g: 140,
          b: 0,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 75,
          g: 0,
          b: 130,
        }}
        onClick={onChange}
      />

      <ColorButton
        color={{
          r: 0,
          g: 250,
          b: 154,
        }}
        onClick={onChange}
      />
    </div>
  );
};

export default ColorPicker;
