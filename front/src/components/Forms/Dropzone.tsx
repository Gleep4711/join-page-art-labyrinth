import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

export default function DropzoneUI({ onFilesChange }: { onFilesChange: (files: File[]) => void }) {
  const [files, setFiles] = React.useState<ExtFile[]>([]);
  const { t } = useTranslation();
  const [isDragActive, setIsDragActive] = React.useState(false);

  React.useEffect(() => {
    const handleDragEnter = () => setIsDragActive(true);
    const handleDragLeave = () => setIsDragActive(false);

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  const updateFiles = (incomingFiles: (ExtFile | undefined)[]) => {
    const validFiles = incomingFiles.filter((file): file is ExtFile => file !== undefined);
    setFiles(validFiles);
    onFilesChange(validFiles.map((file) => file.file as File));
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== Number(id)));
  };

  return (
    <Dropzone
      onChange={updateFiles}
      value={files}
      behaviour="add"
      className="rounded-md mt-2 bg-matchaGreen-50"
      footer={false}
    >
      {files.length === 0 && (
        <div className="flex flex-col justify-center items-center w-full">

          <svg className="w-7" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_36_456)">
              <path opacity="0.5" d="M14.1667 7.50159C15.9792 7.51159 16.9609 7.59242 17.6009 8.23242C18.3334 8.96492 18.3334 10.1433 18.3334 12.4999V13.3333C18.3334 15.6908 18.3334 16.8691 17.6009 17.6016C16.8692 18.3333 15.6901 18.3333 13.3334 18.3333H6.66675C4.31008 18.3333 3.13091 18.3333 2.39925 17.6016C1.66675 16.8683 1.66675 15.6908 1.66675 13.3333V12.4999C1.66675 10.1433 1.66675 8.96492 2.39925 8.23242C3.03925 7.59242 4.02091 7.51159 5.83341 7.50159" stroke="black" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M10 12.5V1.66663M10 1.66663L12.5 4.58329M10 1.66663L7.5 4.58329" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <p className="text-sm w-64">
            {isDragActive ? t("forms.master.image.drag") : t("forms.master.image.input")}
          </p>
        </div>
      )}
      {files.map((file) => (
        <FileMosaic
          key={file.id}
          {...file}
          onDelete={() => removeFile(String(file.id))}
          info
          preview
        />
      ))}
    </Dropzone>
  );
}