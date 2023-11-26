import { z } from 'zod';
import { get } from 'svelte/store'; // 追加: ストアの現在の値を取得するため
import { FileSchema } from './Schema.ts';
import type { FileSchemaType } from './Schema.ts';
import { Files } from './Store.ts';

// Function to get the list of files from Store
export async function getFiles(backendUrl: string) {
    const currentFiles = get(Files); // 現在のfileのリストを取得

    // ストアにFilesがない場合、バックエンドからfileのリストを取得
    if (currentFiles.length === 0) {
        await updateFiles(backendUrl);
    }
}

// Function to get the list of files
async function updateFiles(backendUrl: string) {
    const files: FileSchemaType[] = await fetch(`${backendUrl}/openai_api/get_files`).then(r => r.json());
	// Convert UNIX timestamp to Date object
	files.forEach((file: any) => {
		file.created_at = new Date(file.created_at * 1000);
        file.file_id = file.id;
	});
	// Validate the response data with Zod
	const validatedFiles = z.array(FileSchema).parse(files);
	console.log(validatedFiles);
    console.log(`files: ${JSON.stringify(validatedFiles, null, 2)}`)
    Files.set(validatedFiles);
}


// upload file
export async function uploadFiles(backendUrl: string, files: FileList) {
    console.log(files)
    const formData = new FormData();
    // Append each file to the FormData instance
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const response = await fetch(`${backendUrl}/openai_api/upload_files`, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const responseText = await response.text();
        console.log(responseText);
        updateFiles(backendUrl);  // update file list
        return responseText;
    } else {
        throw new Error('Network response was not ok.');
    }
}


// delete file
export async function deleteFile(backendUrl: string, file_id: string) {
    const response = await fetch(`${backendUrl}/openai_api/delete_file/${file_id}`, {
        method: 'DELETE',
        });
    if (response.ok) {
        const responseText = response.text();
        console.log(responseText);
        updateFiles(backendUrl);  // update file list
        return responseText;
    }
    else {
        throw new Error('Network response was not ok.');
    }
}