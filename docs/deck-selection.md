# Deck Selection Specification

## Context

The Planning Poker application currently uses a fixed voting deck. The facilitator needs to adapt the estimation scale to the team or session type.

## Objective

Allow the facilitator to select the room estimation deck from Fibonacci, T-shirt sizes, or a custom deck.

## Scope

Includes:

- Select the predefined Fibonacci deck.
- Select the predefined T-shirt sizes deck.
- Create a custom deck.
- Apply the selected deck to the room.
- Show participants the cards that belong to the active deck.

Excludes:

- Saving multiple reusable custom deck templates.
- Sharing deck catalogs between rooms.
- Advanced facilitator permissions.
- Collaborative deck editing by all participants.

## Functional Requirements

1. The facilitator must be able to select the Fibonacci deck.
2. The facilitator must be able to select the T-shirt sizes deck.
3. The facilitator must be able to define a custom deck with their own values.
4. The selected deck must determine the cards available for voting.
5. When the deck changes, existing votes must reset to avoid incompatible votes.
6. Participants must see the active deck before voting.
7. The room must have a default deck if the facilitator does not select one.
8. The custom deck must validate that it has at least one usable value.

## Technical Requirements

1. Deck rules must live in the domain or application layer, not directly in React.
2. The UI must consume the active deck from the room state.
3. Card values must be typed or validated to avoid invalid states.
4. Deck selection must be compatible with local persistence if the room already stores local state.
5. The logic must allow adding new predefined decks in the future without rewriting the main flow.

## Acceptance Criteria

- Given a facilitator in a room, when they select Fibonacci, then participants see Fibonacci cards.
- Given a facilitator in a room, when they select T-shirt sizes, then participants see size cards such as `XS`, `S`, `M`, `L`, `XL`.
- Given a facilitator who defines a valid custom deck, when they apply it, then participants see those cards.
- Given a deck change with votes already submitted, when the new deck is applied, then previous votes are cleared.
- Given a user who opens a room without previous configuration, then the room uses a default deck.
- Given an attempt to create an empty custom deck, then the system does not allow applying it.

## Risks / Tradeoffs

- Changing the deck during voting can interrupt the flow, so votes are reset.
- A custom deck that is too long can affect mobile usability.
- If real roles do not exist yet, facilitator may temporarily mean the current local user or room creator.

## Applicable Skills

- `typescript-advanced-types`: useful for modeling deck and custom value types safely.
- `vercel-react-best-practices`: useful for implementing deck selection without duplicated state or unnecessary effects.
- `frontend-design`: useful if a clearer and more polished custom deck creation experience is needed.

## Skill-Based Validation

- Verify that deck rules stay outside React components.
- Verify that changing the deck resets votes through a domain or application rule.
- Verify that the UI works on desktop and mobile with short and long decks.
- Verify that invalid custom values cannot reach the room state.

## Checklist

- Fibonacci deck can be selected.
- T-shirt sizes deck can be selected.
- Custom deck can be defined and applied.
- Active deck determines available voting cards.
- Changing deck clears existing votes.
- Default deck exists for new rooms.
- Invalid custom decks cannot be applied.
- Deck selection is compatible with local state persistence.

## Actions

- Model deck rules in domain or application.
- Validate behavior with predefined and custom deck scenarios.

## Validations

- Select Fibonacci and verify displayed cards.
- Select T-shirt sizes and verify displayed cards.
- Apply a valid custom deck and verify displayed cards.
- Submit a vote, change deck, and verify votes are cleared.
- Try applying an empty custom deck and verify it is blocked.
- Reload the page and verify the selected deck is restored if local state persistence is active.
