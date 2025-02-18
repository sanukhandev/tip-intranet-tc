import * as React from "react";
import type { ITabbedListProps } from "./ITabbedListProps";
import TabbedLayout from "./TabbedLayout";
import Announcements from "../Announcements";
import Birthdays from "../Birthdays";
import Events from "./Events";

export default class TabbedList extends React.Component<ITabbedListProps, {}> {
  constructor(props: ITabbedListProps) {
    super(props);
  }

  public render(): React.ReactElement<ITabbedListProps> {
    return (
      <TabbedLayout>
        <Announcements context={this.props.context} />
        <Events context={this.props.context} />
        <Birthdays context={this.props.context} tab="birthdays" />
        <Birthdays context={this.props.context} tab="anniversaries" />
        <Birthdays context={this.props.context} tab="joiners" />
      </TabbedLayout>
    );
  }
}
