import {Component, OnInit} from '@angular/core';
import { S3} from 'aws-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  imgFile: any;
  // REPLACE WITH YOUR OWN AWS CREDENTIAL
  AWS_ACCESS_KEY_ID = '******';
  AWS_SECRET_ACCESS_KEY = '*****';
  s3 = new S3({
    apiVersion: '2006-03-01',
    // params: {Bucket: 'trail1202'},
    region: 'us-east-1',
    credentials: {accessKeyId: this.AWS_ACCESS_KEY_ID, secretAccessKey: this.AWS_SECRET_ACCESS_KEY},
  });

  ngOnInit(): void {
    // createAlbum bcd, only can created once, comment it out after first refresh
    this.createAlbum('bcd');
    // test for deleting photo, only work when photo already exist
    // this.deletePhoto('abc//Buy.csv');
  }

  getImg(evt) {
    this.imgFile = evt.target.files[0];
    console.log(this.imgFile.name);
    this.uploadImage('abc');
  }
  createAlbum(albumName) {
    albumName = albumName.trim();
    if (!albumName) {
      console.log('Album names must contain at least one non-space character');
      return;
    }
    if (albumName.indexOf('/') !== -1) {
      console.log('Album names cannot contain slashes.');
      return;
    }
    const albumKey = encodeURIComponent(albumName) + '/';
    this.s3.headObject({Bucket: 'trail1202', Key: albumKey}, ((err, data) => {
      if (!err) {
        console.log('Album already exists.');
        return;
      }
      if (err.code !== 'NotFound') {
        console.log('there was an error creating your album: ' + err.message);
        return;
      }
    }))
    this.s3.putObject({Bucket: 'trail1202', Key: albumKey}, ((err, data) => {
      if (err) {
        console.log('There was an error creating your album: ' + err.message
        );
        return;
      }
    }));
  }
  uploadImage(albumName) {
    if (!this.imgFile) {
      console.log('Please chose a file to upload first');
    }
    const fileName = this.imgFile.name;
    const albumPhotosKey = encodeURIComponent(albumName) + '//';
    const photoKey = albumPhotosKey + fileName;
    this.s3.upload({Bucket: 'trail1202', Key: photoKey, Body: this.imgFile, ACL: 'public-read'}, ((err, data) => {
      if (err) {
        console.log('there was an error uploading your photo: ' + err.message);
        return;
      }
    }));
  }
  deletePhoto(photoKey) {
    this.s3.deleteObject({Bucket: 'trail1202', Key: photoKey}, ((err, data) =>  {
      if (err) {
        console.log('There was an error deleting your photo: ' + err.message);
        return;
      }
      }
    ));
  }
}
