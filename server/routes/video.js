const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer")
//=================================
//             Video
//=================================

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})


var upload = multer({ storage: storage }).single("file")

router.post("/uploadfiles", (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename, fileExt: res.req.file.mimetype })
    })

});


router.post("/uploadVideo", (req, res) => {

  //비디오 정보들을 저장한다.
  const video = new Video(req.body)
  video.save((err, doc) => {
      if(err) return res.json({ success: false, err})
      res.status(200).json({ success: true})
    });
});

router.get("/getVideos", (req, res) => {

  //비디오를 DB 에서 가져와서 클라이언트에 보낸다.
  Video.find()
    .populate('writer')
    .exec((err, videos)=> {
      if(err) return res.status(400).send(err);
      res.status(200).json({ success:true, videos })
    })

});

var ffmpeg = require('fluent-ffmpeg');

router.post("/thumbnail", (req, res) => {

    let thumbsFilePath ="";
    let fileDuration ="";

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        fileDuration = metadata.format.duration;
    });

    // 섬네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            thumbsFilePath = "uploads/thumbnails/" + filenames[1];
        })
        .on('end', function () {
            return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        .on('error', function (err) {
            return res.json({ success: false, err });
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });

});



module.exports = router;
