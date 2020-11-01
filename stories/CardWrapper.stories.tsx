import React from "react";
import { Story, Meta } from "@storybook/react";

import Card, { ICardProps } from "../components/card/Card";
import CardWrapper from "../components/card/CardWrapper";

export default {
  title: "Organisms/CardWrapper",
  component: CardWrapper,
} as Meta;

const Template: Story<ICardProps> = (args) => (
  <CardWrapper>
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
    <Card
      title="Skip"
      description="Maybe next time..."
      imageUrl="https://images.unsplash.com/photo-1518365658347-c4906efc5636?auto=format&fit=crop&w=300"
    />
  </CardWrapper>
);

export const Default = Template.bind({});
Default.args = {};
