


export const getAllChapter = async (req,res)=>{
    try {
        const {selectedChapterId} = req.body;


        const dbChapter = await Chapter.findById(selectedChapterId).populate("topics")

        console.log("Chapter",dbChapter)
        

        if(!dbChapter){
            return res.status(404).json({
                success:false,
                message:"Chapter not found"
            })

        }

        res.status(200).json({
            success:true,
            data:dbChapter
        })


    } catch (error) {
        
        
    }
}