import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
    inputClass: string;
    onFilesSelected: (files: FileList | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ inputClass, onFilesSelected }) => {
    const { t } = useTranslation();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const fileList = new DataTransfer();
        acceptedFiles.forEach((file) => fileList.items.add(file));
        onFilesSelected(fileList.files);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div
            {...getRootProps()}
            className={`${inputClass} text-gray-400 text-center text-sm px-10 h-32 flex flex-col justify-center items-center cursor-pointer`}
        >
            <input {...getInputProps()} />
            <p>
                <svg className="w-7" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_36_456)">
                        <path opacity="0.5" d="M14.1667 7.50159C15.9792 7.51159 16.9609 7.59242 17.6009 8.23242C18.3334 8.96492 18.3334 10.1433 18.3334 12.4999V13.3333C18.3334 15.6908 18.3334 16.8691 17.6009 17.6016C16.8692 18.3333 15.6901 18.3333 13.3334 18.3333H6.66675C4.31008 18.3333 3.13091 18.3333 2.39925 17.6016C1.66675 16.8683 1.66675 15.6908 1.66675 13.3333V12.4999C1.66675 10.1433 1.66675 8.96492 2.39925 8.23242C3.03925 7.59242 4.02091 7.51159 5.83341 7.50159" stroke="black" strokeOpacity="0.3" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M10 12.5V1.66663M10 1.66663L12.5 4.58329M10 1.66663L7.5 4.58329" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>
            </p>
            {isDragActive ? (
                <p>{t("forms.master.image.drag")}</p>
            ) : (
                <p>{t("forms.master.image.input")}</p>
            )}
        </div>
    );
};

export default FileUpload;