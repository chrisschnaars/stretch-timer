import React from "react";

interface TitleBlockProps {
  subheading: string;
  heading: string;
  className?: string;
}

const TitleBlock: React.FC<TitleBlockProps> = ({
  subheading,
  heading,
  className = "",
}) => {
  return (
    <div className={`text-center space-y-2 ${className}`.trim()}>
      <p className="subheading">{subheading}</p>
      <h2 className="heading-lg">{heading}</h2>
    </div>
  );
};

export default TitleBlock;
