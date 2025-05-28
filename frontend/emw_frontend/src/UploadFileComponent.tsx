import React , { useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button , TextField} from '@mui/material';
import type { UseFormSetValue, UseFormWatch, FieldError } from 'react-hook-form';

export default function UploadFileComponent({setValue, watch, error}:{setValue : UseFormSetValue<any>, watch: UseFormWatch<any>, error?: FieldError;}) {

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setValue("thumbnail", selected, { shouldValidate: true });
    
    const fileReader = new FileReader();

    fileReader.onload = () => {
        // console.log('file', fileReader.result);
        setPreview(fileReader.result as string);
    };

    fileReader.readAsDataURL(e.target.files![0]);


  };

//   const handleUpload = async () => {
//     if (!file) {
//       console.error("No file selected");
//       return;
//     }
//     const formData = new FormData();
//     formData.append('file', file);
//   };

    return (
        <>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                >
                Choose File
                <VisuallyHiddenInput
                    type="file"
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={handleFileChange}
                    // multiple
                />
            </Button>
            {file && (
                <section>
                File details:
                <ul>
                    <li>Name: {file.name}</li>
                    <li>Type: {file.type}</li>
                    <li>Size: {file.size} bytes</li>
                </ul>
                { preview && (<img src={ preview } alt="Preview" style={{ width: '200px', height: '200px' }} />) }
                </section>
            )}

            {error && <p style={{ color: "red" }}>{error.message}</p>}
        
            {/* {file && (
                <button 
                onClick={handleUpload}
                className="submit"
                >Upload a file</button>
            )} */}

            </>
  )
}
