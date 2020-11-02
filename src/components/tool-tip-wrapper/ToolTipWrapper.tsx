import React from 'react';
import ReactTooltip from 'react-tooltip';

export default function ToolTipWrapper(props: any) {
  const {
    id,
    effect, delayHide,
    delayShow, delayUpdate,
    place, border, type,
    className,
  } = props;

  return (
    <ReactTooltip
      id={id}
      getContent={(dataTip) => `${dataTip}`}
      effect={effect || "solid"}
      delayHide={delayHide || 500}
      delayShow={delayShow || 3000}
      delayUpdate={delayUpdate || 500}
      place={place || "top"}
      border={border || true}
      type={type || "light"}
      class={`tooltip-react-container ${className}`}
    />
  )
}
