import { IsString } from 'class-validator';

/*
*TThe first thing to do is to create a data transfer object (DTO) file that carries data between our functions.
*It contains specification on how should the incoming data look.
*/

class CreatePostDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;
}

export default CreatePostDto;
