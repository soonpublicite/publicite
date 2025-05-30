import {
  CustomInput,
  CustomSelect,
  CustomTextarea,
} from "@/components/inputs/CustomInputs";
import PlaceAutocomplete from "@/components/inputs/PlaceAutocomplete";
import { BusinessSector, UserBusinessFormValues } from "@/types/userTypes";
import { Field, FormikErrors } from "formik";
import { FaLink, FaXTwitter } from "react-icons/fa6";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoWhatsapp,
} from "react-icons/io";

interface OnboardingBusinessInputsProps {
  errors: FormikErrors<UserBusinessFormValues>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<UserBusinessFormValues>>;
  businessSectors: BusinessSector[];
}

const OnboardingBusinessInputs = ({
  errors,
  setFieldValue,
  businessSectors,
}: OnboardingBusinessInputsProps) => {
  return (
    <>
      <div className="flex gap-4 w-full max-2xl:flex-col">
        <Field
          as={CustomInput}
          name="businessName"
          label="Nombre de la Empresa"
          aria-label="nombre"
          isInvalid={!!errors.businessName}
          errorMessage={errors.businessName}
          placeholder="Ingrese nombre de la empresa"
          isRequired
        />
        <Field
          as={PlaceAutocomplete}
          isRequired
          name="countryRegion"
          isInvalid={!!errors.countryRegion}
          errorMessage={errors.countryRegion}
          onSelectionChange={(value: string) =>
            setFieldValue("countryRegion", value)
          }
        />
      </div>
      <Field
        as={CustomInput}
        name="dni"
        label="CUIT/DNI"
        aria-label="dni o cuit"
        isRequired
        //only accept numbers and dashes
        pattern="^[0-9-]+$"
        isInvalid={!!errors.dni}
        type="text"
        errorMessage={errors.dni}
        placeholder="Ingrese el CUIT de la empresa sin puntos ni espacios"
        description="Utilizaremos su CUIT para realizar la facturación en caso de suscribirse."
      />
      <div className="flex gap-4 w-full max-2xl:flex-col">
        <Field
          as={CustomSelect}
          name="sector"
          isRequired
          label="Rubro de la Empresa"
          aria-label="rubro de la empresa"
          placeholder="Seleccione el rubro"
          items={businessSectors}
          isInvalid={!!errors.sector}
          errorMessage={errors.sector}
          renderItem={(item: BusinessSector) => (
            <div className="flex flex-col gap-1">
              <p>{item.label}</p>
              <p className="small-text">{item.description}</p>
            </div>
          )}
          getItemLabel={(item: BusinessSector) => item.label}
          getItemTextValue={(item: BusinessSector) =>
            `${item.label}: ${item.description}`
          }
          getItemValue={(item: BusinessSector) => item._id}
        />
        <Field
          as={CustomInput}
          startContent={<IoLogoWhatsapp className="text-green-600" />}
          name="contact.phone"
          label="Contacto / Teléfono"
          isInvalid={!!errors.contact?.phone}
          errorMessage={errors.contact?.phone}
          aria-label="contacto"
          placeholder="Ingrese teléfono de contacto"
        />
      </div>
      <div className="flex gap-4 w-full max-2xl:flex-col">
        <Field
          as={CustomInput}
          name="contact.facebook"
          label="Facebook"
          startContent={<IoLogoFacebook className=" text-blue-600" />}
          aria-label="facebook"
          isInvalid={!!errors.contact?.facebook}
          errorMessage={errors.contact?.facebook}
          placeholder="Link a Facebook"
        />
        <Field
          as={CustomInput}
          name="contact.instagram"
          label="Instagram"
          startContent={
            <IoLogoInstagram className="instagram-gradient text-white rounded-md overflow-hidden" />
          }
          aria-label="instagram"
          isInvalid={!!errors.contact?.instagram}
          errorMessage={errors.contact?.instagram}
          placeholder="Link a Instagram"
        />
      </div>
      <div className="flex gap-4 w-full max-2xl:flex-col">
        <Field
          as={CustomInput}
          name="contact.x"
          label="X/Twitter"
          startContent={<FaXTwitter className=" text-slate-900" />}
          aria-label="twitter"
          isInvalid={!!errors.contact?.x}
          errorMessage={errors.contact?.x}
          placeholder="Link a X/Twitter"
        />
        <Field
          as={CustomInput}
          name="contact.website"
          startContent={<FaLink className=" text-text-color" />}
          label="Website"
          aria-label="website"
          isInvalid={!!errors.contact?.website}
          errorMessage={errors.contact?.website}
          placeholder="Link a página web"
        />
      </div>
      <Field
        as={CustomTextarea}
        name="description"
        label="Descripción"
        aria-label="descripcion"
        placeholder="Ingrese una descripción para su empresa"
      />
    </>
  );
};

export default OnboardingBusinessInputs;
