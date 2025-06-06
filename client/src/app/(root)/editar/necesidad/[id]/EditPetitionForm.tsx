import AttachedFiles from "@/app/(root)/crear/anuncio/components/CreateForm/inputs/AccordionInputs/AttachedFIles/AttachedFiles";
import { useAttachedFiles } from "@/app/(root)/crear/anuncio/components/CreateForm/inputs/AccordionInputs/AttachedFIles/AttachedFilesContext";
import Visibility from "@/app/(root)/crear/anuncio/components/CreateForm/inputs/AccordionInputs/Visibility";
import TitleDescription from "@/app/(root)/crear/anuncio/components/CreateForm/inputs/TitleDescription";
import PetitionType from "@/app/(root)/crear/necesidad/PetitionType";
import { petitionEditValidation } from "@/app/(root)/crear/necesidad/petititonValidation";
import PriceRangeCategory from "@/app/(root)/crear/necesidad/PriceRangeCategory";
import { editPost } from "@/app/server/postActions";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import RequiredFieldsMsg from "@/components/chips/RequiredFieldsMsg";
import { CustomDateInput } from "@/components/inputs/CustomInputs";
import { Petition, PetitionPostValues } from "@/types/postTypes";
import { POSTS } from "@/utils/data/urls";
import { toastifyError, toastifySuccess } from "@/utils/functions/toastify";
import useUploadFiles from "@/utils/hooks/useUploadFiles";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";

type EditPetitionFormValues = Omit<
  PetitionPostValues,
  "createAt" | "geoLocation" | "author" | "postBehaviourType" | "isActive"
>;

const EditPetitionForm = ({ postData }: { postData: Petition }) => {
  const router = useRouter();
  const {
    attachedFiles,
    setPrevAttachedFiles,
    prevAttachedFiles,
    prevAttachedFilesDeleted,
  } = useAttachedFiles();
  useEffect(() => {
    setPrevAttachedFiles(postData.attachedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { progress, submitFiles, deleteFiles } = useUploadFiles(
    [],
    attachedFiles,
    true,
    true
  );
  const initialValues: EditPetitionFormValues = {
    attachedFiles: postData.attachedFiles,
    category: postData.category[0]._id,
    description: postData.description,
    price: postData.price,
    postType: postData.postType,
    title: postData.title,
    visibility: postData.visibility,
    frequencyPrice: postData.frequencyPrice,
    petitionType: postData.petitionType,
    toPrice: postData.toPrice,
    endDate: postData.endDate.split("T")[0],
  };
  const handleSubmit = async (
    values: EditPetitionFormValues,
    actions: FormikHelpers<any>
  ) => {
    if (
      values.endDate < today(getLocalTimeZone()).toString() ||
      values.endDate > today(getLocalTimeZone()).add({ years: 1 }).toString()
    ) {
      actions.setFieldError(
        "endDate",
        "La fecha de finalización debe ser posterior a la fecha actual y no más de 1 año"
      );
      actions.setSubmitting(false);
      return;
    }
    // delete prev files deleted
    await deleteFiles(prevAttachedFilesDeleted.map((file) => file.url));
    // upload new files if any
    if (attachedFiles.length) {
      values = await submitFiles(values, actions);
    } else {
      // update prevAttachedFiles with new values
      values.attachedFiles = prevAttachedFiles;
    }

    // edit post
    const resApi = await editPost(
      {
        ...values,
        frequencyPrice: values.frequencyPrice ? values.frequencyPrice : null,
        category: [values.category],
      },
      postData._id,
      postData.author.username
    );
    if (resApi.error) {
      toastifyError(resApi.error);
      return;
    }
    actions.resetForm();
    toastifySuccess("Anuncio editado exitosamente");
    router.refresh();
    router.push(`${POSTS}/${resApi.id}`);
  };
  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={petitionEditValidation}
    >
      {({ isSubmitting, errors, setFieldValue, values }) => {
        return (
          <Form id="edit-need-form" className="flex flex-col gap-4 w-full">
            <div className="flex gap-8 md:gap-4 w-full max-md:flex-col">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <TitleDescription
                  errors={errors}
                  setFieldValue={setFieldValue}
                />
                <PetitionType errors={errors.petitionType} />
                <Field
                  as={CustomDateInput}
                  name="endDate"
                  errorMessage={errors.endDate}
                  isInvalid={!!errors.endDate}
                  label="Fecha de Vencimiento"
                  aria-label="fecha de vencimiento"
                  description="La fecha de vencimiento es la fecha en la que el anuncio se considera vencido. Luego podrá cambiarla o renovarla."
                  onChange={(value: CalendarDate) =>
                    setFieldValue("endDate", value ? value.toString() : "")
                  }
                  minValue={today(getLocalTimeZone())}
                  maxValue={today(getLocalTimeZone()).add({ years: 1 })}
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <PriceRangeCategory
                  setFieldValue={setFieldValue}
                  errors={errors}
                  defaultChecked={values.toPrice ? true : false}
                />
                <Visibility
                  errors={errors}
                  postBehaviourType={postData.postBehaviourType}
                />
                <div className="flex lg:px-4 flex-col gap-4">
                  <h6>Archivos Adjuntos (opcional)</h6>
                  <AttachedFiles
                    errors={errors.attachedFiles}
                    maxFiles={1}
                    isEditing={true}
                  />
                </div>
              </div>
            </div>
            <RequiredFieldsMsg />
            <PrimaryButton
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              type="submit"
              className="self-start"
            >
              {isSubmitting
                ? attachedFiles.length > 0
                  ? `Editando ${progress}%`
                  : "Editando"
                : "Editar Necesidad"}
            </PrimaryButton>
            {Object.keys(errors).length > 0 && (
              <p className="text-danger text-sm">
                Por favor corrija los errores
              </p>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditPetitionForm;
