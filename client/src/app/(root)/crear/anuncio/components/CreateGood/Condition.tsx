import { CustomSelect } from "@/components/inputs/CustomInputs";
import { conditionItems } from "@/utils/data/selectData";
import { GoodPostValues } from "@/types/postTypes";
import { Field, FormikErrors } from "formik";

const Condition = ({ errors }: { errors: FormikErrors<GoodPostValues> }) => {
  return (
    <Field
      as={CustomSelect}
      items={conditionItems}
      getItemValue={(item: any) => item.value}
      getItemTextValue={(item: any) => item.label}
      getItemLabel={(item: any) => item.label}
      name="condition"
      label="Estado"
      placeholder="Seleccione la condición"
      aria-label="condición"
      isRequired
      isInvalid={!!errors.condition}
      errorMessage={errors.condition}
    />
  );
};

export default Condition;
