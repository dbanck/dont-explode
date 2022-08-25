import React from "react";
import { Story, Meta } from "@storybook/react";

import Card, { ICardProps } from "../components/card/Card";

export default {
  title: "Molecules/Card",
  component: Card,
} as Meta;

const Template: Story<ICardProps> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Booom!",
  description: "Here's some card event description",
  imageUrl:
    "https://images.unsplash.com/photo-1530433331547-e064ffe8eef1?&auto=format&fit=crop&w=300",
};

export const Backface = Template.bind({});
Backface.args = {
  isBackface: true,
  hovering: false,
};
