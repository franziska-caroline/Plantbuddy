import styled from "styled-components";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function FilterForm({
  plants,
  onAddPreference,
  initialFilterSettings = {},
  initialFilterTitle = "",
  onEditPreference,
  preferenceId,
}) {
  const router = useRouter();

  const initialState = {
    preferenceTitle: initialFilterTitle,
    plantSize: initialFilterSettings.plantSize || "",
    sunlightRequirement: initialFilterSettings.sunlightRequirement || "",
    waterNeeds: initialFilterSettings.waterNeeds || "",
    optimalTemperature: initialFilterSettings.optimalTemperature || "",
    petFriendly: initialFilterSettings.petFriendly || "",
  };

  const [state, setState] = useState(initialState);

  if (!plants) {
    return null;
  }

  // Separate filter functions
  const filterPlantSize = (plantId, size) =>
    !size || plants.find((plant) => plant.id === plantId)?.size === size;
  const filterSunlightRequirement = (plantId, requirement) =>
    !requirement ||
    plants.find((plant) => plant.id === plantId)?.sunlightRequirements ===
      requirement;
  const filterWaterNeeds = (plantId, needs) =>
    !needs ||
    plants.find((plant) => plant.id === plantId)?.waterNeeds === needs;
  const filterOptimalTemperature = (plantId, temperature) =>
    !temperature ||
    plants.find((plant) => plant.id === plantId)?.optimalTemperature ===
      temperature;
  const filterPetFriendly = (plantId, isPetFriendly) =>
    !isPetFriendly ||
    plants.find((plant) => plant.id === plantId)?.petFriendly ===
      (isPetFriendly === "true");

  function handleSubmit(event) {
    event.preventDefault();

    const { plantSize, sunlightRequirement, waterNeeds, optimalTemperature, petFriendly } = state;

    const filterSettings = {
      plantSize,
      sunlightRequirement,
      waterNeeds,
      optimalTemperature,
      petFriendly,
    };

    const preferenceData = {
      preferenceTitle: state.preferenceTitle,
      preferencePlants: plants
        .filter(
          (plant) =>
            filterPlantSize(plant.id, state.plantSize) &&
            filterSunlightRequirement(plant.id, state.sunlightRequirement) &&
            filterWaterNeeds(plant.id, state.waterNeeds) &&
            filterOptimalTemperature(plant.id, state.optimalTemperature) &&
            filterPetFriendly(plant.id,state.petFriendly)
        )
        .map((plant) => plant.id),
      filterSettings,
    };

    if (preferenceId) {
      // Editing an existing preference
      onEditPreference({ ...preferenceData, id: preferenceId });
      router.push("/preferences");
    } else {
      // Adding a new preference
      onAddPreference(preferenceData);
      event.target.reset();
    }

    event.target.elements.title.focus();
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledLabel htmlFor="title">Add your preference title</StyledLabel>
      <StyledTitleInput
        type="text"
        id="title"
        name="title"
        placeholder="Add here your Preference Title"
        minLength="3"
        maxLength="25"
        required
        value={state.preferenceTitle}
        onChange={(event) => setState({ ...state, preferenceTitle: event.target.value })}
      />

      <StyledLabel htmlFor="plantSize">Select the plant size:</StyledLabel>
      <StyledSelect
        name="plantSize"
        id="plantSize"
        onChange={(event) => setState({ ...state, plantSize: event.target.value })}
        defaultValue={state.plantSize}
      >
        <option value="">Select Size</option>
        <option value="small">Small (15cm-50cm)</option>
        <option value="medium">Medium (50cm-90cm)</option>
        <option value="large">Large (90cm+)</option>
      </StyledSelect>

      <StyledLabel htmlFor="sunlightRequirement">
        Select the sunlight Requirement:
      </StyledLabel>
      <StyledSelect
        name="sunlightRequirement"
        id="sunlightRequirement"
        onChange={(event) => setState({ ...state, sunlightRequirement: event.target.value })}
        defaultValue={state.sunlightRequirement}
      >
        <option value="">Select Sunlight Requirement</option>
        <option value="full sun">Full Sun</option>
        <option value="indirect light">Indirect Light</option>
        <option value="half-shade">Half-Shade</option>
      </StyledSelect>

      <StyledLabel htmlFor="waterNeeds">Select the water needs:</StyledLabel>
      <StyledSelect
        name="waterNeeds"
        id="waterNeeds"
        onChange={(event) => setState({ ...state, waterNeeds: event.target.value })}
        defaultValue={state.waterNeeds}
      >
        <option value="">Select Water Needs</option>
        <option value="weekly">Weekly</option>
        <option value="every other week">Every other week</option>
        <option value="monthly">Monthly</option>
      </StyledSelect>

      <StyledLabel htmlFor="optimalTemperature">
        Select the optimal temperature:
      </StyledLabel>
      <StyledSelect
        name="optimalTemperature"
        id="optimalTemperature"
        onChange={(event) => setState({ ...state, optimalTemperature: event.target.value })}
        defaultValue={state.optimalTemperature}
      >
        <option value="">Select Temperature</option>
        <option value="low">15-20°C</option>
        <option value="average">18-25°C</option>
        <option value="high">20-30°C</option>
      </StyledSelect>

      <StyledLabel htmlFor="petFriendly">
        Select the pet compatibility:
      </StyledLabel>
      <StyledSelect
        name="petFriendly"
        id="petFriendly"
        onChange={(event) => setState({ ...state, petFriendly: event.target.value })}
        defaultValue={state.petFriendly}
      >
        <option value="">Select Pet Compatibility</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </StyledSelect>
      <StyledButtonContainer>
        <StyledButton type="reset">Cancel</StyledButton>
        <StyledButton type="submit">Save</StyledButton>
      </StyledButtonContainer>
    </StyledForm>
  );
}

const StyledForm = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  max-width: 19rem;
  margin: 1rem auto 1rem auto;
  padding: 0rem 0rem 2rem 0;
  border-bottom: 2px solid var(--color-grey);
`;

const StyledTitleInput = styled.input`
  background-color: var(--color-grey);
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  color: var(--color-green);
  border: none;
  font-weight: 600;
  cursor: pointer;

  &::placeholder {
    color: var(--color-lightGreen);
    font-weight: 600;
  }
`;

const StyledLabel = styled.label`
  border: 0;
  padding: 0;
  margin: 0;
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  white-space: nowrap;
`;

const StyledSelect = styled.select`
  background-color: var(--color-grey);
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  color: var(--color-green);
  border: none;
  font-weight: 600;
  cursor: pointer;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button`
  color: white;
  background-color: var(--color-green);
  border: none;
  border-radius: 8px;
  padding: 0.6rem 0.4rem;
  font-weight: 600;
  cursor: pointer;
  width: 9rem;
`;
