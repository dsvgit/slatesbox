import React from "react";

const Card = ({ children }: React.PropsWithChildren<{}>) => {
  return <div className="card">{children}</div>;
};

export default Card;
