import React from "react";
import { Story, Meta } from "@storybook/react";

import Card, { ICardProps } from "../components/card/Card";
import CardWrapper from "../components/card/CardWrapper";

export default {
  title: "Organisms/CardWrapper",
  component: CardWrapper,
  argTypes: {
    amount: { control: "number" },
  },
} as Meta;

const Template: Story<ICardProps & { amount: number }> = (args) => (
  <CardWrapper position="bottom">
    {Array.from(Array(args.amount).keys()).map((card) => (
      <Card
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
  amount: 20,
};
