import * as React from "react";
import type { ITabbedListProps } from "./ITabbedListProps";

// import Events from "./Events";
// import Birthdays from "./Birthdays";
// import Anniversaries from "./Anniversaries";
// import Joiners from "./Joiners";
import TabbedLayout from "./TabbedLayout";
import Announcements from "../Announcements";
import Events from "./Events";

interface ITabbedComponentState {
  announcements: any[];
  events: any[];
  birthdays: any[];
  anniversaries: any[];
  joiners: any[];
}

export default class TabbedList extends React.Component<
  ITabbedListProps,
  ITabbedComponentState
> {
  constructor(props: ITabbedListProps) {
    super(props);
    this.state = {
      announcements: [],
      events: [],
      birthdays: [],
      anniversaries: [],
      joiners: [],
    };
  }

  public render(): React.ReactElement<ITabbedListProps> {
    return (
      <TabbedLayout>
        <Announcements context={this.props.context} />
        <Events context={this.props.context} />
        <div />
      </TabbedLayout>
    );
  }
}
