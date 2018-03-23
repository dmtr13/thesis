﻿//~ Adapted from: https://forums.adobe.com/thread/1222258//~
// make a reference to the savedFolder
//~ var savedFolder = new Folder('~/Desktop/Merged Image');
//~
// create the folder if it doesn't exists
// get the source folder from the user and store in variable
var sourceFolder = Folder.selectDialog();
var savedFolder = new Folder(sourceFolder + '/Merged');
if(!savedFolder.exists) savedFolder.create();
// get an array of red images and store in variable
  var sourceFiles = sourceFolder.getFiles("*B5_b.jpg");
  // make a loop to process all found sets.
  for(var i = 0; i < sourceFiles.length;i++){
    var blueName = sourceFiles[i].name;
    var blueImage = open(sourceFiles[i]);
    // open the red file and store reference to document
    var redName = blueName.replace('_b.jpg','_r.jpg');
    var redImage = open(new File(sourceFolder+'/'+redName));
    // open the green file and store reference that document
    applyChannel( charIDToTypeID( "RGB " ) , blueImage.name );
    var greenName = blueName.replace('_b.jpg', '_g.jpg');
    if ((new File(sourceFolder+'/'+greenName).exists)){
      var greenImage = open(new File(sourceFolder+'/'+greenName));
      applyChannel ( charIDToTypeID( "RGB " ), redImage.name);
    SaveAsTIFF(savedFolder+'/'+blueName.replace(/_b\.jpg$/i,'_merged.tif'),true);

function applyChannel( channelID, documentName ){
  // charIDToTypeID( "RGB " )
  // charIDToTypeID( "Rd  " )
  // charIDToTypeID( "Grn " )
  // charIDToTypeID( "Bl  " )
  var desc = new ActionDescriptor();
  var channelsDesc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), channelID);
  ref.putProperty( charIDToTypeID( "Lyr " ), charIDToTypeID( "Bckg" ) );
  ref.putName( charIDToTypeID( "Dcmn" ), documentName );
  channelsDesc.putReference( charIDToTypeID( "T   " ), ref );
  channelsDesc.putEnumerated( charIDToTypeID( "Clcl" ), charIDToTypeID( "Clcn" ), charIDToTypeID( "Lghn" ) );
  channelsDesc.putBoolean( charIDToTypeID( "PrsT" ), true );
  desc.putObject( charIDToTypeID( "With" ), charIDToTypeID( "Clcl" ), channelsDesc );
  executeAction( charIDToTypeID( "AppI" ), desc, DialogModes.NO );
};

function SaveAsTIFF( inFileName, inLZW ) {
  var tiffSaveOptions = new TiffSaveOptions();
  if ( inLZW ) {
    tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
  }
  else {
    tiffSaveOptions.imageCompression = TIFFEncoding.NONE;
  }
  app.activeDocument.saveAs( File( inFileName ), tiffSaveOptions );
  // Close the documents no longer needed
  activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  if (blueImage.length != 0){
    blueImage.close(SaveOptions.DONOTSAVECHANGES)
  }
  if (redImage.length != 0){
    redImage.close(SaveOptions.DONOTSAVECHANGES)
  }
};
