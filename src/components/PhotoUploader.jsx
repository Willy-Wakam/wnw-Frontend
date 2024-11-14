/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function PhotoUploader({addedPhotos, onChange}){
    function change(val, func){
        func(val.target.value);
    }

    function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for(let i=0; i<files.length; i++){
            data.append('photos', files[i])
        }
        axios.post('/upload', data, {
            headers: {
                'Content-Type': 'multipart/form.data'
            }
        }).then(response =>{
            const filename = response.data;
            onChange(prev => {
                return [...prev, ...filename];
            });
        })
        ;
    }

    async function addPhotoByLink(ev){
        const {data:filename} = await axios.post('/upload-by-link', {
            link: photoLink,
        });
        onChange(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
        ev.preventDefault();
    };

    function changePhotoOrder(name){
        onChange([{newName:name}, ... addedPhotos.filter(photo => photo.newName !== name)]);
    }

    function removePhoto(name) {
        const newArray = addedPhotos.filter(photo => photo.newName !== name);
        onChange(newArray);
    }
    const [photoLink, setPhotoLink] = useState('');
    return (
        <>
            
            <div className="flex gap-4">
                                <input type="text" name="" id="link" placeholder="Add using a link ..." value={photoLink} onChange={e => change(e, setPhotoLink)}/>
                                <button  onClick={addPhotoByLink} type="button" className="text-white flex justify-center items-center gap-2 font-bold bg-primary grow border rounded-lg px-4 shadow-md shadow-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    Add&nbsp;photo
                                </button>
                            </div>
                            <div className="mt-2 grid gap-4  grid-cols-3 md:grid-cols-4 lg:grid-cols-6" key={uuidv4()}>   
                            {
                                    addedPhotos.length > 0 && addedPhotos.map((linkPhoto, index) => 
                                    <>
                                        <div key={linkPhoto?.newName} className="relative group flex h-40">
                                            <img className="rounded-lg shadow-md shadow-gray-200 z-0 w-full object-cover" 
                                                    src={"http://localhost:4000/uploads/" + linkPhoto?.newName} key={uuidv4() + "-" + index + "-" + linkPhoto?.newName} alt="" />
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={() => removePhoto(linkPhoto?.newName)} 
                                                    className="size-6 z-40 bg-primary 
                                                    absolute right-1 top-1 rounded-lg mr-1 mt-1 cursor-pointer hidden 
                                                    group-hover:block text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                            {linkPhoto?.newName !== addedPhotos[0].newName && (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick={() => changePhotoOrder(linkPhoto?.newName)} 
                                                className="size-6 
                                                    absolute right-1 bottom-1 rounded-lg mr-1 mt-1 cursor-pointer 
                                                     text-white">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                </svg>
                                            )}
                                            {linkPhoto?.newName === addedPhotos[0]?.newName && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                                className="size-6 absolute right-1 bottom-1 rounded-lg mr-1 mt-1 cursor-pointer 
                                                     text-yellow-400">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>  
                                    </>)
                                }                      
                                <label type="button" className="h-40 border bg-transparent cursor-pointer rounded-lg p-6 text-2xl text-gray-600 flex items-center gap-2 justify-center shadow-md shadow-gray-300"> 
                                    <input type="file" multiple name="file" id="file" className="hidden" onChange={uploadPhoto}/>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                    Upload 
                                </label>
                            </div> 
        </>
    )
}