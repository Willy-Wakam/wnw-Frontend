/* eslint-disable react/prop-types */
export default function PerksLabel({selected, onChange, perksList}){
    const checkedList = [...selected];
    function handleCbChange(name){
        if(checkedList.includes(name)) onChange(checkedList.filter(elem => elem !== name));
        else onChange([...checkedList, name])
    }
    
    return (
        <>
            <div className="grid gap-2 grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
                                {
                                    perksList.map((perk, index) =>
                                        <>
                                            <label htmlFor={perk} className="flex gap-4 mt-2 border p-2 rounded-lg cursor-pointer" key={perk} >
                                                <input type="checkbox" checked={checkedList.includes(perk)} name={perk} id={perk} onChange={() => handleCbChange(perk)} role={perk} key={index}/>
                                                <span className="flex gap-1" key={perk+index}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                                                    </svg>                                 
                                                    {perk}
                                                </span>
                                            </label>
                                        </>
                                        )
                                }
            </div>
        </>
    );
}