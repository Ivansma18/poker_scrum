# Facilitator Control Specification

## Context

Currently, sensitive room actions such as revealing votes, resetting the round, or changing the deck can be executed from the UI without explicit permission control. This can cause accidental changes during estimation.

## Objective

Allow only authorized facilitator users to reveal votes, reset the round, change the deck, and change the current story.

## Scope

Includes:

- Identify whether the current user is a facilitator or participant.
- Restrict sensitive actions to facilitators.
- Disable restricted actions for users without permissions.
- Keep normal voting available for non-facilitator participants.
- Apply control to revealing votes, resetting the round, changing the deck, and changing the current story.

Excludes:

- Real account authentication.
- Advanced role management.
- Audit logs.
- Configurable permissions per action.
- Remote role synchronization between devices.

## Functional Requirements

1. The room must distinguish between facilitators and participants.
2. Only facilitators may reveal votes.
3. Only facilitators may reset the round.
4. Only facilitators may change the deck.
5. Only facilitators may change the current story.
6. Participants without facilitator role must be able to vote normally.
7. The UI must clearly communicate when an action is unavailable because of permissions.
8. If no real user system exists, the local room creator must be treated as facilitator.
9. When joining a room, the user must be treated as participant by default.
10. Permission rules must live in the domain or application layer, not only in React components.
11. Restricted actions must be blocked even if a user attempts to trigger them from the UI.

## Technical Requirements

1. The room or local session model must include enough information to know whether the current user can facilitate.
2. Sensitive actions must validate permissions in the domain or application layer.
3. The UI must derive enabled/disabled states from permission rules.
4. Permission control must be compatible with existing local persistence.
5. The domain must not depend on browser APIs or React.
6. The implementation should allow migration to real authentication later without rewriting all permission rules.

## Acceptance Criteria

- Given a facilitator user, when they view the room, then they can reveal votes, reset the round, change the deck, and change the current story.
- Given a non-facilitator participant, when they view the room, then they cannot reveal votes, reset the round, change the deck, or change the current story.
- Given a non-facilitator participant, when they vote, then their vote is registered normally.
- Given an unauthorized user, when they attempt to execute a restricted action, then the action does not modify the room.
- Given the local creator of a room, when they enter the created room, then they have facilitator permissions.
- Given a user who joins an existing room, when they enter, then they does not have facilitator permissions by default.
- Given the page reloads and local persisted state exists, when the room is restored, then the local role is restored.

## Risks / Tradeoffs

- Without real authentication, permission control is local and not fully secure against manual manipulation.
- If roles are not synchronized remotely, different devices may have different permission views.
- Disabling buttons with explanations is clearer than hiding them, but it may add visual noise.
- Treating the local creator as facilitator is practical, but may not represent real multiuser rooms.

## Applicable Skills

- `typescript-advanced-types`: useful for modeling roles and permissions safely.
- `vercel-react-best-practices`: useful for deriving permissions without duplicating React state.
- `accessibility`: useful to ensure disabled actions and permission messages are understandable.
- `frontend-design`: useful if a clearer role/permission UI is needed.

## Skill-Based Validation

- Verify that permission rules stay outside React.
- Verify that the UI does not duplicate authorization logic.
- Verify that restricted buttons communicate why they are disabled.
- Verify that users without permission can still vote.

## Checklist

- Facilitator and participant roles exist.
- Local creator becomes facilitator.
- Joined users become participants.
- Role is locally persisted.
- Facilitators can reveal votes.
- Facilitators can reset rounds.
- Facilitators can change decks.
- Facilitators can change current story.
- Participants can vote.
- Participants cannot execute restricted actions.
- Disabled restricted actions show a brief explanation.

## Actions

- Model permissions in domain/application.
- Validate facilitator and participant flows.

## Validations

- Create a room and verify facilitator actions are enabled.
- Join a room and verify facilitator actions are disabled.
- Join as participant and verify voting works.
- Attempt restricted actions as participant and verify the room does not change.
- Reload and verify the local role is restored.
- Verify disabled actions explain that only facilitators can use them.
