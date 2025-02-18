import * as React from "react";
import PnpService from "../../service/pnpService";
import { EMPLOYEE_MASTER, BIRTHDAY_COMMENTS } from "../../CONSTANTS";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { getUserProfilePicture } from "../../helper";

interface IBirthday {
  FullName: string;
  Designation: string;
  Picture: string;
  Birthday: string;
  EmpCode: string;
  EmpId: number;
}

interface IComment {
  Id: number; // Unique ID for the comment (needed for updating Likes)
  Comment: string;
  Likes: number;
  PostedBy: {
    Title: string;
    EMail: string;
  };
}

interface IBirthdaysState {
  birthdays: IBirthday[];
  activeBirthdayIndex: number;
  comments: IComment[];
  newComment: string;
}

export default class Birthdays extends React.Component<
  { context: WebPartContext },
  IBirthdaysState
> {
  constructor(props: { context: WebPartContext }) {
    super(props);
    this.state = {
      birthdays: [],
      activeBirthdayIndex: 0,
      comments: [],
      newComment: "",
    };
  }

  public async componentDidMount(): Promise<void> {
    PnpService.init(this.props.context);
    const birthdays = await this.getBirthdays();
    if (birthdays.length > 0) {
      this.setState({ birthdays, activeBirthdayIndex: 0 }, () => {
        this.fetchComments(birthdays[0].EmpId);
      });
    } else {
      this.setState({ birthdays });
    }
  }

  private async getBirthdays(): Promise<IBirthday[]> {
    const items = await PnpService.getItemsAndExpand(
      EMPLOYEE_MASTER,
      [
        "FullName",
        "Designation",
        "Birthday",
        "EmpCode",
        "Picture/EMail",
        "Picture/Id",
      ],
      ["Picture"]
    );
    return items.map((item) => ({
      FullName: item.FullName,
      Designation: item.Designation,
      EmpCode: item.EmpCode,
      Picture: getUserProfilePicture(item.Picture?.EMail),
      Birthday: item.Birthday,
      EmpId: item.Picture?.Id,
    }));
  }

  private async fetchComments(empId: number): Promise<void> {
    const comments = await PnpService.getItemsAndExpand(
      BIRTHDAY_COMMENTS,
      [
        "Id",
        "Comment",
        "Likes",
        "PostedBy/Title",
        "PostedBy/EMail",
        "EmployeeIDId",
      ],
      ["PostedBy"]
    );
    const filteredComments = comments.filter((c) => c.EmployeeIDId === empId);
    this.setState({
      comments: filteredComments.map((comment) => ({
        Id: comment.Id, // Store the unique ID for updates
        Comment: comment.Comment,
        Likes: comment.Likes,
        PostedBy: {
          Title: comment.PostedBy.Title,
          EMail: comment.PostedBy.EMail,
        },
      })),
    });
  }

  private handleBirthdayClick(index: number) {
    this.setState({ activeBirthdayIndex: index, newComment: "" }, () => {
      const activeBirthday = this.state.birthdays[index];
      if (activeBirthday) {
        this.fetchComments(activeBirthday.EmpId);
      }
    });
  }

  private async postComment(): Promise<void> {
    const { newComment, birthdays, activeBirthdayIndex } = this.state;
    if (!newComment.trim()) return;

    const activeEmpId = birthdays[activeBirthdayIndex].EmpId;

    await PnpService.createItem(BIRTHDAY_COMMENTS, {
      EmployeeIDId: activeEmpId,
      Comment: newComment,
      PostedById: await PnpService.getCurrentUserId(), // Get current logged-in user ID
      Likes: 0, // Default likes count
    });

    this.setState({ newComment: "" }, () => this.fetchComments(activeEmpId));
  }

  private async likeComment(
    commentId: number,
    currentLikes: number
  ): Promise<void> {
    try {
      await PnpService.updateItem(BIRTHDAY_COMMENTS, commentId, {
        Likes: currentLikes + 1, // Increment likes count
      });

      // Refresh comments to reflect the updated like count
      this.fetchComments(
        this.state.birthdays[this.state.activeBirthdayIndex].EmpId
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  }

  public render(): React.ReactElement<{}> {
    const { birthdays, activeBirthdayIndex, comments, newComment } = this.state;
    const activeBirthday =
      birthdays.length > 0 ? birthdays[activeBirthdayIndex] : null;

    return (
      <div
        className="tab-pane fade active show"
        id="birthdays"
        role="tabpanel"
        aria-labelledby="birthdays-tab"
      >
        <div className="row">
          {/* Left Section - Birthday List */}
          <div className="col-md-5">
            <div className="nav verticle-custom flex-column nav-pills">
              {birthdays.map((birthday, index) => (
                <button
                  key={index}
                  className={`nav-link d-flex align-items-center py-3 text-start ${
                    index === activeBirthdayIndex ? "active" : ""
                  }`}
                  onClick={() => this.handleBirthdayClick(index)}
                >
                  <div className="col-3">
                    <img
                      src={birthday.Picture}
                      alt={birthday.FullName}
                      className="rounded-circle"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </div>
                  <div className="col-9">
                    <h6 className="mb-0 fw-bold text-black">
                      {birthday.FullName}
                    </h6>
                    <p className="mb-0 opacity-50 text-black">
                      <small>{birthday.Designation}</small>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Section - Birthday Comments */}
          <div className="col-md-7">
            <div className="tab-content verticle-custom">
              {activeBirthday ? (
                <div className="tab-pane fade show active">
                  <div className="card p-3">
                    <div className="card-body p-0">
                      {/* Comments Section */}
                      <div className="mt-3">
                        <h6 className="fw-bold">Comments</h6>
                        {comments.length > 0 ? (
                          comments.map((comment, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-start mb-2"
                            >
                              <div className="col-2">
                                <img
                                  src={getUserProfilePicture(
                                    comment.PostedBy.EMail
                                  )}
                                  alt={comment.PostedBy.Title}
                                  className="rounded-circle"
                                  style={{ width: "40px", height: "40px" }}
                                />
                              </div>
                              <div className="col-10">
                                <div className="w-100 p-2 rounded-3 border">
                                  <h6 className="mb-0">
                                    {comment.PostedBy.Title}
                                  </h6>
                                  <p className="mb-1">{comment.Comment}</p>
                                  <button
                                    className="btn btn-secondary rounded-5 px-3 py-1 fw-bold"
                                    onClick={() =>
                                      this.likeComment(
                                        comment.Id,
                                        comment.Likes
                                      )
                                    }
                                  >
                                    ❤️ {comment.Likes}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No comments yet.</p>
                        )}
                      </div>

                      {/* Input Box for Posting a Comment */}
                      <div className="w-100 position-sticky bottom-0 bg-white">
                        <input
                          type="text"
                          className="form-control w-100 rounded-3 p-3"
                          placeholder="Write a Birthday Wish..."
                          value={newComment}
                          onChange={(e) =>
                            this.setState({ newComment: e.target.value })
                          }
                        />
                        <button
                          className="btn-primary btn"
                          onClick={() => this.postComment()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No birthdays found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
