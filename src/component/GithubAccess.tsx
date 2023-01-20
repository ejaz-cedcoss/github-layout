import {
  BodyLayout,
  Button,
  Card,
  FlexLayout,
  Grid,
  Modal,
  PageHeader,
  Select,
  Tabs,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { FC, useEffect, useState } from "react";
import { List, PlusCircle } from "react-feather";

const GithubAccess: FC = () => {
  const [team, setTeam] = useState<any>([]);
  const [id, setId] = useState("");

  const [teamMember, setTeamMember] = useState<any>([]);
  const [teamRepo, setTeamRepo] = useState<any>([]);
  const [allMember, setAllMember] = useState<any>([]);
  const [repo, setRepo] = useState<string>("");

  const [counter, setCounter] = useState<any>(5);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [collaborators, setCollaborator] = useState<any>([]);

  const [collboratorLoading, setCollaboratorLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colors = ["#a4e4cf", "#98a1f1", "#b793c0", "#e1e292"];

  /** Request Authorization Parameters*/
  let RequestAuth = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
    },
  };

  /**fetching parent team */
  const fetchParentTeam = () => {
    fetch(
      `https://api.github.com/orgs/${process.env.REACT_APP_ORG_NAME}/teams/${process.env.REACT_APP_TEAM_NAME}`,
      RequestAuth
    )
      .then((e) => e.json())
      .then((res) => {
        let temp = [];
        temp.push(res);
        temp.map((e: any, index: any) => {
          e.teamType = "Parent";
          return index === 0 ? setId(e?.id) : null;
        });

        const temp1 = temp.map((val: any, index: any) => {
          return {
            content: val.name,
            id: val.id,
            badge: true,
            badgeContent: val?.teamType,
            customBgColors: colors[index],
          };
        });
        setTeam([...temp1]);
      });
  };
  /**FIND MEMBER ROLE FUNCTION */
  const findMemberRole = (username: any) => {
    const memberRoleFetch = () => {
      fetch(`https://api.github.com/teams/${id}/memberships/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GIT_TOKEN}`,
        },
      })
        .then((e) => e.json())
        .then((res) => {
          const tempTeamMember = [...teamMember];
          tempTeamMember.forEach((val) => {
            val.role = res.role;
          });
          setTeamMember([...tempTeamMember]);
        })
        .finally(() => {});
    };
    memberRoleFetch();
  };

  /**GET COLLABORATOR FUNCTION  */
  const getCollaborator = (repoName: any) => {
    setCollaboratorLoading(true);
    fetch(
      `https://api.github.com/repos/${process.env.REACT_APP_ORG_NAME}/${repoName}/collaborators`,
      RequestAuth
    )
      .then((e) => e.json())
      .then((res) => {
        setCollaborator([...res]);
      })
      .finally(() => {
        setCollaboratorLoading(false);
      });
    setOpenModal(true);
    setRepo(repoName);
  };

  /** VIEW MORE DATA FUNCTION */
  const ViewMoreData = () => {
    setCounter(counter + 5);
  };

  // FETCHING TEAMS:-
  useEffect(() => {
    const fetchChildTeam = () => {
      fetch(
        `https://api.github.com/orgs/${process.env.REACT_APP_ORG_NAME}/teams/${process.env.REACT_APP_TEAM_NAME}/teams
      `,
        RequestAuth
      )
        .then((e) => e.json())
        .then((res) => {
          if (res.length === 0) {
            fetchParentTeam();
          } else {
            res.map((e: any, index: any) => {
              e.teamType = "ChildTeam";
              return index === 0 ? setId(e?.id) : null;
            });

            const temp = res.map((val: any, index: any) => {
              return {
                content: val.name,
                id: val.id,
                badge: true,
                badgeContent: val?.teamType,
                customBgColors: colors[index],
              };
            });
            setTeam([...temp]);
          }
        });
    };
    fetchChildTeam();
  }, []);

  // FETCHING CHILD TEAM MEMBERS:-
  useEffect(() => {
    const TeamMemberFun = () => {
      setLoading(true);
      fetch(
        `https://api.github.com/teams/${id}/members?page=1&per_page=${counter}`,
        RequestAuth
      )
        .then((e) => e.json())
        .then((res) => {
          setTeamMember([...res]);
        })
        .finally(() => setLoading(false));
    };
    const allTeamMeberFun = () => {
      fetch(`https://api.github.com/teams/${id}/members`, RequestAuth)
        .then((e) => e.json())
        .then((res) => {
          setAllMember([...res]);
        });
    };
    id !== "" && TeamMemberFun();
    allTeamMeberFun();
  }, [id, counter]);

  // FETCHING TEAM REPOSITORY:-
  useEffect(() => {
    fetch(`https://api.github.com/teams/${id}/repos`, RequestAuth)
      .then((e) => e.json())
      .then((res) => {
        setTeamRepo([...res]);
      });
  }, [id]);

  /**member column */
  const memberCol = [
    {
      align: "left",
      dataIndex: "name",
      key: "name",
      title: "USERNAME",
      width: 100,
    },
    {
      align: "center",
      dataIndex: "githubProfile",
      key: "githubProfile",
      title: "GITHUB PROFILE",
      width: 100,
    },
    {
      align: "center",
      dataIndex: "memberRole",
      key: "memberRole",
      title: "Member Role ",
      width: 100,
    },
  ];

  /**Repository column */
  const repoCol = [
    {
      align: "left",
      dataIndex: "name",
      key: "name",
      title: "Team's Repository",
      width: 100,
    },
    {
      align: "left",
      dataIndex: "accessLevel",
      key: "accessLevel",
      title: "Access Level",
      width: 100,
    },
    {
      align: "left",
      dataIndex: "repo_URL",
      key: "repo_URL",
      title: "Repository URL",
      width: 100,
    },
    {
      align: "left",
      dataIndex: "visibility",
      key: "visibility",
      title: "Repository Type",
      width: 100,
    },
    {
      align: "center",
      dataIndex: "collaborator",
      key: "collaborator",
      title: "Collaborator's",
      width: 100,
    },
  ];

  // collaborator's columns:-
  const collaboratorCol = [
    {
      align: "left",
      dataIndex: "collaborators",
      key: "collaborators",
      title: "Collaborator's Name",
    },
  ];

  return (
    <>
      <BodyLayout>
        <Card>
          <PageHeader title="Teams:-" />
          <Tabs
            alignment="horizontal"
            onChange={(e) => setId(e)}
            selected={id}
            value={team}
          >
            <Card cardType="Bordered">
              <FlexLayout halign="fill">
                <TextStyles content="Members:" type="Heading" />
                <div style={{ padding: "10px" }}>
                  <Select
                    labelInLine
                    name="Select Rows"
                    value={counter}
                    onChange={(e) => setCounter(e)}
                    options={[
                      {
                        label: "5",
                        value: "5",
                      },
                      {
                        label: "10",
                        value: "10",
                      },
                      {
                        label: "25",
                        value: "25",
                      },
                      {
                        label: "50",
                        value: "50",
                      },
                    ]}
                  />
                </div>
              </FlexLayout>
              <Grid
                columns={memberCol}
                loading={loading}
                dataSource={teamMember.map((val: any) => {
                  return {
                    key: val.login,
                    name: val.login,
                    githubProfile: (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <a href={val?.repos_url} target="_blank">
                          {val?.repos_url}
                        </a>
                      </div>
                    ),
                    memberRole: val.role ?? (
                      <Button type="TextButton" content="Fetching...">
                        {findMemberRole(val.login)}
                      </Button>
                    ),
                  };
                })}
              />
              {allMember.length > teamMember.length ? (
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="Outlined"
                    content="view more"
                    icon={<PlusCircle color="green" />}
                    onClick={() => {
                      ViewMoreData();
                    }}
                  />
                </div>
              ) : (
                ""
              )}

              {/* // MODAL SECTION */}
              <Modal
                open={openModal}
                close={() => setOpenModal(!openModal)}
                heading={`All Collaborator's ( ${repo} ):`}
                modalSize="medium"
                secondaryAction={{
                  content: "Close",
                  loading: false,
                  onClick: () => setOpenModal(!openModal),
                }}
              >
                <Grid
                  loading={collboratorLoading}
                  columns={collaboratorCol}
                  showHeader={false}
                  dataSource={collaborators.map((val: any) => {
                    return {
                      key: val.login,
                      collaborators: (
                        <div style={{ textAlign: "center" }}>{val.login}</div>
                      ),
                    };
                  })}
                />
              </Modal>
            </Card>
            {/* REPOSITORY GRID  */}
            <Card cardType="Bordered">
              <TextStyles content="Repositories:" type="Heading" />
              <Grid
                columns={repoCol}
                dataSource={teamRepo.map((val: any) => {
                  return {
                    key: val.name,
                    name: val.name,
                    accessLevel: val.role_name,
                    visibility: val?.visibility,
                    repo_URL: <a href="#d">{val?.clone_url}</a>,
                    collaborator: (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          type="TextButton"
                          icon={<List />}
                          content="show"
                          onClick={() => getCollaborator(val?.name)}
                        ></Button>
                      </div>
                    ),
                  };
                })}
              />
            </Card>
          </Tabs>
        </Card>
      </BodyLayout>
    </>
  );
};

export default GithubAccess;
