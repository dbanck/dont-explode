import React from "react";
import { Story, Meta } from "@storybook/react";

import Card from "../components/card/Card";
import CardWrapper, { ICardWrapperProps } from "../components/card/CardWrapper";

export default {
  title: "Organisms/CardWrapper",
  component: CardWrapper,
  argTypes: {
    amount: { control: "number" },
  },
} as Meta;

const Template: Story<ICardWrapperProps & { amount: number }> = ({
  amount,
  position,
  playersTurn,
}) => (
  <CardWrapper position={position} playersTurn={playersTurn}>
    {Array.from(Array(amount).keys()).map((card) => (
      <Card
        isBackface={position !== "bottom"}
        key={card}
        title={card.toString()}
        description="Maybe next time..."
        imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
      />
    ))}
  </CardWrapper>
);

export const Default = Template.bind({});
Default.args = {
  amount: 8,
  position: "bottom",
  playersTurn: false,
};
